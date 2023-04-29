import { BaseEntity } from '../base-entity';
import { DbAdapter } from './db.adapter';
import { DbSortDirection } from './types';
import { BehaviorSubject, AsyncSubject, of } from 'rxjs';
import { switchMap, tap, map, take } from 'rxjs/operators';
import { DbQuery, DbOptions } from './types';
import {
  InfinityList,
  HotObservableOnce,
  PaginationList,
  ColdObservableOnce,
} from '../types';
import { SearchAdapter } from '../search/search.adapter';
import { SearchQuery } from '../search/types';

export function reverseDirection(direction: DbSortDirection): DbSortDirection {
  return direction === DbSortDirection.Asc
    ? DbSortDirection.Desc
    : DbSortDirection.Asc;
}

export function makeDbInfinityList<T extends BaseEntity>(
  dbAdapter: DbAdapter<T>,
  query: DbQuery = {},
  options?: DbOptions
): InfinityList<T> {
  let limit = query.limit || 20;
  const limitSubject = new BehaviorSubject<number>(limit);
  const hasMoreSubject = new BehaviorSubject<boolean>(false);
  const totalCountSubject = new BehaviorSubject<number>(0);
  let moreProcessing = false;

  return {
    valueChange: limitSubject.asObservable().pipe(
      switchMap((l) => dbAdapter.listChange({ ...query, limit: l }, options)),
      tap((response) => {
        totalCountSubject.next(response.totalCount);
        hasMoreSubject.next(response.count === limitSubject.getValue());
        moreProcessing = false;
      }),
      map((response) => response.docs)
    ),
    totalCount: totalCountSubject.asObservable(),
    hasMoreChange: hasMoreSubject.asObservable(),
    more(requestLimit?: number): HotObservableOnce<void> {
      if (requestLimit) {
        limit = requestLimit;
      }

      if (moreProcessing || !hasMoreSubject.getValue()) {
        return of(null);
      }

      moreProcessing = true;
      limitSubject.next(limitSubject.getValue() + limit);

      return hasMoreSubject.asObservable().pipe(
        take(1),
        map(() => {})
      );
    },
  };
}

export function makeDbPaginationList<T extends BaseEntity>(
  dbAdapter: DbAdapter<T>,
  query: DbQuery = {},
  options?: DbOptions
): PaginationList<T> {
  query.limit = query.limit || 20;
  const emitSubject = new BehaviorSubject<'prev' | 'next'>(null);
  const pageSubject = new BehaviorSubject<number>(0);
  const totalCountSubject = new AsyncSubject<number>();

  let lt: any;
  let gt: any;
  let page = 0;

  return {
    valueChange: emitSubject.asObservable().pipe(
      switchMap((emit) => {
        let doc;

        if (emit === 'prev') {
          delete query.lt;
          delete query.gt;
          doc = { lt };
        } else if (emit === 'next') {
          doc = { gt };
          delete query.lt;
          delete query.gt;
        }

        return dbAdapter.listChange({ ...query, ...doc }, options).pipe(
          tap((response) => {
            if (!totalCountSubject.closed) {
              totalCountSubject.next(response.totalCount);
              totalCountSubject.complete();
            }
          }),
          tap(() => {
            if (emit === 'prev') {
              pageSubject.next(page - 1);
              page--;
            } else if (emit === 'next') {
              pageSubject.next(page + 1);
              page++;
            }
          })
        );
      }),
      tap((response) => {
        console.log('response', response);
        lt = response.firstDoc;
        gt = response.lastDoc;
      }),
      map((response) => response.docs)
    ),
    totalCountChange: totalCountSubject.asObservable(),
    pageChange: pageSubject.asObservable(),
    prev(): HotObservableOnce<number> {
      emitSubject.next('prev');

      return pageSubject.asObservable().pipe(take(1));
    },
    next(): HotObservableOnce<number> {
      emitSubject.next('next');

      return pageSubject.asObservable().pipe(take(1));
    },
    updatePage(page: number): void {
      pageSubject.next(page);
    },
  };
}

export function makeSearchPaginationList<T extends BaseEntity>(
  searchAdapter: SearchAdapter<T>,
  query: SearchQuery = {}
): PaginationList<T> {
  const pageSubject = new BehaviorSubject<number>(0);
  const totalCountSubject = new BehaviorSubject<number>(0);

  return {
    valueChange: pageSubject.asObservable().pipe(
      switchMap((page) => {
        return searchAdapter.search({ ...query, page }).pipe(
          tap((response) => {
            totalCountSubject.next(response.totalCount);
          })
        );
      }),
      map((response) => response.hits)
    ),
    totalCountChange: totalCountSubject.asObservable(),
    pageChange: pageSubject.asObservable(),

    prev(): ColdObservableOnce<number> {
      const page = pageSubject.getValue();

      pageSubject.next(page - 1);

      return of(page - 1);
    },
    next(): ColdObservableOnce<number> {
      const page = pageSubject.getValue();

      pageSubject.next(page + 1);

      return of(page + 1);
    },
    updatePage(page: number): void {
      pageSubject.next(page);
    },
  };
}
