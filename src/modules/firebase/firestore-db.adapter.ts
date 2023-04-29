import { from, Observable, combineLatest, forkJoin, of } from 'rxjs';
import { map, take, switchMap, first } from 'rxjs/operators';
import { BaseEntity } from '../../core/base-entity';
import { DbAdapter } from '../../core/db/db.adapter';
import {
  DbQuery,
  DbOptions,
  DbListResponse,
  DbBatchItems,
  DbSortDirection,
} from '../../core/db/types';
import {
  reverseDirection,
  makeDbPaginationList,
  makeDbInfinityList,
} from '../../core/db/utils';
import {
  HotObservableOnce,
  ColdObservableOnce,
  ColdObservable,
  PaginationList,
  InfinityList,
} from '../../core/types';
import { makeHot, isEmptyObject } from '../../core/utils';
import * as resolvePath from 'object-resolve-path';
import firebase from 'firebase/compat/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export interface FirestoreDbConfig {
  parentCollectionNames?: string[];
  recordTime?: boolean;
  countFields?: string[];
}

export class FirestoreDbAdapter<E extends BaseEntity> implements DbAdapter<E> {
  createdAtDescQuery: DbQuery = {
    sorts: [{ field: 'createdAt', direction: DbSortDirection.Desc }],
  };

  constructor(
      protected db: firebase.firestore.Firestore,
      protected collectionName: string,
      protected config: FirestoreDbConfig = {}
  ) {
    this.config.parentCollectionNames = this.config.parentCollectionNames || [];
    this.config.recordTime = this.config.recordTime !== false;
  }

  getDocumentSnapShot(
      id: string,
      options: DbOptions = {}
  ): ColdObservableOnce<DocumentSnapshot<DocumentData>> {
    return from(this.db.doc(this.makePathWithId(id, options.parentIds)).get());
  }

  get(id: string, options: DbOptions = {}): ColdObservableOnce<E> {
    return from(
        this.db.doc(this.makePathWithId(id, options.parentIds)).get()
    ).pipe(map((snap) => this.convertSnapshotToEntity(snap)));
  }

  getChange(id: string, options: DbOptions = {}): ColdObservable<E> {
    return this.convertFirestoreDocumentOnSnapshotToObservable(
        this.db.doc(this.makePathWithId(id, options.parentIds))
    ).pipe(map((snap) => this.convertSnapshotToEntity(snap)));
  }

  getMany(ids: string[], options: DbOptions = {}): ColdObservableOnce<E[]> {
    const promises = [];

    for (const id of ids) {
      promises.push(
          this.db.doc(this.makePathWithId(id, options.parentIds)).get()
      );
    }

    return from(Promise.all(promises)).pipe(
        map((snaps) => snaps.map((snap) => this.convertSnapshotToEntity(snap)))
    );
  }

  getManyChange(ids: string[], options: DbOptions = {}): ColdObservable<E[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    } else {
      return combineLatest(ids.map((id) => this.getChange(id)));
    }
  }

  list(
      query: DbQuery<E> = {},
      options: DbOptions = {}
  ): ColdObservableOnce<DbListResponse<E>> {
    const ref: firebase.firestore.Query<firebase.firestore.DocumentData> =
        this.db.collection(this.makePath(options.parentIds));

    if (!query && this.config.recordTime) {
      query = this.createdAtDescQuery;
    }

    return forkJoin([
      from(this.convertQueryForFirestore(query, ref).get()),
      this.count(query, { parentIds: options.parentIds }).pipe(take(1)),
    ]).pipe(
        map(([snaps, totalCount]) =>
            this.makeListResponse(snaps, totalCount, Boolean(query.lt))
        )
    );
  }

  listChange(
      query: DbQuery<E> = {},
      options: DbOptions = {}
  ): ColdObservable<DbListResponse<E>> {
    const ref: firebase.firestore.Query<firebase.firestore.DocumentData> =
        this.db.collection(this.makePath(options.parentIds));

    if (!query && this.config.recordTime) {
      query = this.createdAtDescQuery;
    }

    return combineLatest([
      this.convertFirestoreCollectionOnSnapshotToObservable(
          this.convertQueryForFirestore(query, ref)
      ),
      this.count(query, { parentIds: options.parentIds }),
    ]).pipe(
        map(([snaps, totalCount]) =>
            this.makeListResponse(snaps, totalCount, Boolean(query.lt))
        )
    );
  }

  paginationList(query?: DbQuery, options?: DbOptions): PaginationList<E> {
    if (!query && this.config.recordTime) {
      query = this.createdAtDescQuery;
    }

    return makeDbPaginationList(this, query, options);
  }

  infinityList(query?: DbQuery, options?: DbOptions): InfinityList<E> {
    if (!query && this.config.recordTime) {
      query = this.createdAtDescQuery;
    }

    return makeDbInfinityList(this, query, options);
  }

  count(query: DbQuery = {}, options: DbOptions = {}): ColdObservable<number> {
    const path = this.makeCountPath(options.parentIds);

    return this.convertFirestoreDocumentOnSnapshotToObservable(
        this.db.doc(path)
    ).pipe(
        map((snap) => {
          if (snap.exists) {
            const data: any = snap.data();

            if (query.filters && query.filters[0]) {
              return (
                  data[`${query.filters[0].field}=${query.filters[0].value}`] || 0
              );
            }

            return data.total;
          }

          return 0;
        })
    );
  }

  countIncrease(
      field: string,
      increase: number,
      options: DbOptions = {}
  ): HotObservableOnce<void> {
    const path = this.makeCountPath(options.parentIds);

    return from(
        this.db
            .doc(path)
            .update({ [field]: firebase.firestore.FieldValue.increment(increase) })
    );
  }

  countDecrease(
      field: string,
      decrease: number,
      options: DbOptions = {}
  ): HotObservableOnce<void> {
    return this.countIncrease(field, decrease * -1, options);
  }

  add(entity: Partial<E>, options: DbOptions = {}): HotObservableOnce<E> {
    const path = this.makePath(options.parentIds);

    let id = entity.id;

    delete entity.id;

    if (!id) {
      id = this.db.collection(path).doc().id;
    }

    return makeHot<E>(
        from(this.addWithCount(id, entity, path)).pipe(
            switchMap(() => this.getChange(id, { parentIds: options.parentIds })),
            first<E>(Boolean)
        )
    );
  }

  update(
      id: string,
      update: Partial<E>,
      options: DbOptions = {}
  ): HotObservableOnce<void> {
    if (this.config.countFields) {
      return from(
          this.updateWithCount(id, update, this.makePath(options.parentIds))
      );
    }

    return from(
        this.db
            .doc(this.makePathWithId(id, options.parentIds))
            .update(
                this.config.recordTime
                    ? { ...update, modifiedAt: firebase.firestore.Timestamp.now() }
                    : update
            )
    );
  }

  increase(
      id: string,
      field: keyof E,
      increase: number,
      options: DbOptions = {}
  ): HotObservableOnce<void> {
    return this.update(
        id,
        { [field]: firebase.firestore.FieldValue.increment(increase) } as any,
        options
    );
  }

  decrease(
      id: string,
      field: keyof E,
      decrease: number,
      options: DbOptions = {}
  ): HotObservableOnce<void> {
    return this.increase(id, field, decrease * -1, options);
  }

  upsert(
      id: string,
      entity: Partial<E>,
      options: DbOptions = {}
  ): HotObservableOnce<E> {
    const path = this.makePath(options.parentIds);
    const pathWithId = `${path}/${id}`;

    return makeHot<E>(
        from(this.db.doc(pathWithId).get()).pipe(
            switchMap((snap) => {
              if (snap.exists) {
                return this.update(id, entity, options).pipe(
                    switchMap(() => this.get(id, options))
                );
              } else {
                return this.add({ ...entity, id }, options);
              }
            })
        )
    );
  }

  delete(id: string, options: DbOptions = {}): HotObservableOnce<void> {
    const path = this.makePath(options.parentIds);

    return from(this.deleteWithCount(id, path));
  }

  batch(
      items: DbBatchItems<E>,
      options: DbOptions = {}
  ): HotObservableOnce<any> {
    const batch = this.db.batch();

    if (items.set) {
      for (const item of items.set) {
        batch.set(
            this.db.doc(this.makePathWithId(item.id, options.parentIds)),
            item.data
        );
      }
    }

    if (items.update) {
      for (const item of items.update) {
        batch.update(
            this.db.doc(this.makePathWithId(item.id, options.parentIds)),
            item.data
        );
      }
    }

    if (items.delete) {
      for (const item of items.delete) {
        batch.delete(
            this.db.doc(this.makePathWithId(item.id, options.parentIds))
        );
      }
    }

    return from(batch.commit());
  }

  transaction(
      callback: (
          db: firebase.firestore.Firestore
      ) => (transaction: firebase.firestore.Transaction) => any
  ): HotObservableOnce<any> {
    return from(this.db.runTransaction(callback(this.db)));
  }

  private convertSnapshotToEntity(
      snap: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ): E {
    return snap.exists
        ? ({ ...this.convertFirestoreToEntity(snap.data()), id: snap.id } as E)
        : null;
  }

  private convertFirestoreToEntity(
      documentData: firebase.firestore.DocumentData
  ): any {
    if (
        documentData instanceof firebase.firestore.Timestamp &&
        documentData.toDate
    ) {
      return documentData.toDate();
    } else if (Array.isArray(documentData)) {
      const node = [];

      for (const data of documentData) {
        node.push(this.convertFirestoreToEntity(data));
      }

      return node;
    } else if (documentData === null) {
      return null;
    } else if (typeof documentData === 'object') {
      const data = { ...documentData };

      if (Object.keys(data).length > 0) {
        for (const key in data) {
          if (data.hasOwnProperty(key) && data[key]) {
            data[key] = this.convertFirestoreToEntity(data[key]);
          }
        }

        return data;
      }
    } else {
      return documentData;
    }
  }

  private makePath(parentIds: string[] = []): string {
    const namesLength = this.config.parentCollectionNames.length;

    if (!namesLength) {
      return this.collectionName;
    }

    if (namesLength !== parentIds.length) {
      throw new Error('Parent collection 이름과 id의 갯수가 맞지 않습니다.');
    }

    let path = '';
    for (let i = 0; i < namesLength; i++) {
      if (i !== 0) {
        path += '/';
      }

      path += `${this.config.parentCollectionNames[i]}/${parentIds[i]}`;
    }

    return `${path}/${this.collectionName}`;
  }

  private makePathWithId(id: string, parentIds: string[] = []): string {
    return `${this.makePath(parentIds)}/${id}`;
  }

  private makeCountPath(parentIds: string[] = []): string {
    let path = 'counts/';

    if (this.config.parentCollectionNames) {
      path += this.makePath(parentIds);
    } else {
      path += this.collectionName;
    }

    return path;
  }

  private convertQueryForFirestore(
      query: DbQuery<E> = {},
      ref: firebase.firestore.Query<firebase.firestore.DocumentData>
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    const reverse = Boolean(query.lt);

    if (query.filters && query.filters.length) {
      for (const filter of query.filters) {
        if (filter.logical === 'or') {
          throw new Error('Firestore에서는 "or"로 filtering 할 수 없습니다.');
        }

        if (filter.comparison === '!=' || filter.comparison === 'text') {
          throw new Error(
              'Firestore에서는 "!="와 "text"로 filtering 할 수 없습니다.'
          );
        }

        ref = ref.where(filter.field, filter.comparison, filter.value);
      }
    }

    if (query.sorts && query.sorts.length) {
      for (const sort of query.sorts) {
        ref = ref.orderBy(
            sort.field,
            reverse ? reverseDirection(sort.direction) : sort.direction
        );
      }
    }

    if (query.lt && query.gt) {
      throw new Error('less than과 greater than은 함께 사용할 수 없습니다.');
    }

    if (query.lt) {
      ref = ref.startAfter(query.lt);
    }

    if (query.gt) {
      ref = ref.startAfter(query.gt);
    }

    if (query.limit > 0) {
      ref = ref.limit(query.limit);
    }

    return ref;
  }

  private makeListResponse(
      snaps: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
      totalCount: number,
      reverse = false
  ): DbListResponse<E> {
    const docs = snaps.docs.map((snap) => this.convertSnapshotToEntity(snap));
    return {
      docs: reverse ? docs.reverse() : docs,
      totalCount,
      count: snaps.size,
      firstDoc: snaps.docs[reverse ? snaps.size - 1 : 0],
      lastDoc: snaps.docs[reverse ? 0 : snaps.size - 1],
    };
  }

  private convertFirestoreDocumentOnSnapshotToObservable(
      ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  ): Observable<firebase.firestore.DocumentSnapshot> {
    return new Observable((subscriber) => {
      ref.onSnapshot(
          (next) => subscriber.next(next),
          (err) => subscriber.error(err),
          () => subscriber.complete()
      );
    });
  }

  private convertFirestoreCollectionOnSnapshotToObservable(
      ref: firebase.firestore.Query<firebase.firestore.DocumentData>
  ): Observable<firebase.firestore.QuerySnapshot> {
    return new Observable((subscriber) => {
      ref.onSnapshot(
          (next) => subscriber.next(next),
          (err) => subscriber.error(err),
          () => subscriber.complete()
      );
    });
  }

  private async addWithCount(
      id: string,
      entity: Partial<E>,
      path: string
  ): Promise<void> {
    const pathWithId = `${path}/${id}`;

    await this.db.runTransaction(async (transaction) => {
      const countDoc = {
        total: firebase.firestore.FieldValue.increment(1),
      };

      if (this.config.countFields) {
        for (const countField of this.config.countFields) {
          const value = resolvePath(entity, countField);

          if (value) {
            if (Array.isArray(value)) {
              for (const v of value) {
                countDoc[`${countField}=${v}`] =
                    firebase.firestore.FieldValue.increment(1);
              }
            } else {
              countDoc[`${countField}=${value}`] =
                  firebase.firestore.FieldValue.increment(1);
            }
          }
        }
      }

      const promises = [
        transaction.set(
            this.db.doc(pathWithId),
            this.config.recordTime
                ? {
                  ...entity,
                  createdAt: firebase.firestore.Timestamp.now(),
                  modifiedAt: firebase.firestore.Timestamp.now(),
                }
                : entity
        ),
        transaction.set(this.db.doc(`counts/${path}`), countDoc, {
          merge: true,
        }),
      ];

      await Promise.all(promises);
    });
  }

  private updateWithCount(
      id: string,
      update: Partial<E>,
      path: string
  ): Promise<void> {
    return this.db.runTransaction(async (transaction) => {
      const countDoc = {};

      const ref = this.db.doc(`${path}/${id}`);

      if (this.config.countFields) {
        const snap = await transaction.get(ref);

        const entity = snap.data();

        for (const countField of this.config.countFields) {
          const value = resolvePath(entity, countField);
          const updateValue =
              update[countField] || resolvePath(update, countField);

          if (value && updateValue) {
            if (Array.isArray(value)) {
              for (const v of value) {
                if (updateValue.indexOf(v) === -1) {
                  countDoc[`${countField}=${v}`] =
                      firebase.firestore.FieldValue.increment(-1);
                }
              }
            } else {
              if (value !== updateValue) {
                countDoc[`${countField}=${value}`] =
                    firebase.firestore.FieldValue.increment(-1);
              }
            }
          } else if (value && updateValue === null) {
            countDoc[`${countField}=${value}`] =
                firebase.firestore.FieldValue.increment(-1);
          }

          if (updateValue) {
            if (Array.isArray(updateValue)) {
              for (const v of updateValue) {
                if (!value || value.indexOf(v) === -1) {
                  countDoc[`${countField}=${v}`] =
                      firebase.firestore.FieldValue.increment(1);
                }
              }
            } else {
              if (value !== updateValue) {
                countDoc[`${countField}=${updateValue}`] =
                    firebase.firestore.FieldValue.increment(1);
              }
            }
          }
        }

        if (!isEmptyObject(countDoc)) {
          transaction.set(this.db.doc(`counts/${path}`), countDoc, {
            merge: true,
          });
        }
      }

      transaction.update(
          ref,
          this.config.recordTime
              ? { ...update, modifiedAt: firebase.firestore.Timestamp.now() }
              : update
      );
    });
  }

  private deleteWithCount(id: string, path: string): Promise<void> {
    return this.db.runTransaction(async (transaction) => {
      const countDoc = {
        total: firebase.firestore.FieldValue.increment(-1),
      };

      const ref = this.db.doc(`${path}/${id}`);

      if (this.config.countFields) {
        const snap = await transaction.get(ref);

        const entity = snap.data();

        for (const countField of this.config.countFields) {
          const value = resolvePath(entity, countField);

          if (value) {
            if (Array.isArray(value)) {
              for (const v of value) {
                countDoc[`${countField}=${v}`] =
                    firebase.firestore.FieldValue.increment(-1);
              }
            } else {
              countDoc[`${countField}=${value}`] =
                  firebase.firestore.FieldValue.increment(-1);
            }
          }
        }
      }

      await Promise.all([
        transaction.delete(ref),
        transaction.set(this.db.doc(`counts/${path}`), countDoc, {
          merge: true,
        }),
      ]);
    });
  }
}
