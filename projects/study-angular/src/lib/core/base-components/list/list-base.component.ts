import { Directive, OnInit } from '@angular/core';
import { SubscriptionBaseComponent } from '../subscription/subscription-base.component';
import { BaseEntity } from '../../../../../../../src/core/base-entity';
import { NgRouteService } from '../../services/route.service';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import {
  DbOptions,
  DbQuery,
  DbSortDirection,
} from '../../../../../../../src/core/db/types';
import { LibClientList } from './types';
import { ScrollPositionService } from '../../services/scroll-position.service';
import { replaceQueryParams } from '../../utils';
import { filter, map } from 'rxjs/operators';
import { ColdObservableOnce } from '../../types';

@Directive()
export abstract class ListBaseComponent<ListType, E extends BaseEntity>
  extends SubscriptionBaseComponent
  implements OnInit, LibClientList<ListType, E>
{
  list: E[];
  count: number = 0;
  currentPage: number = 1;

  dbQuery$: BehaviorSubject<DbQuery> = new BehaviorSubject<DbQuery>(undefined);
  dbQueryHistory: DbQuery;

  isLoading = false;

  limit: number = 10;

  defaultDbQuery: DbQuery = {
    limit: this.limit,
    sorts: [{ field: 'createdAt', direction: DbSortDirection.Desc }],
  };

  protected constructor(
    protected routeService: NgRouteService,
    protected scrollPositionService: ScrollPositionService,
    protected service: any,
    protected methodName: string
  ) {
    super();
    this.onIsLoading();
  }

  ngOnInit(): void {
    this.setSubscription('_initParams', this.initParams());
    this.setSubscription('_initQueryParams', this.initQueryParams());
    this.setSubscription('_initDbQuery', this.initDbQuery());
    this.setObservable(
      'isLoading',
      'isLoading',
      this.scrollPositionService.isLoading$
    );
  }

  abstract setDbQuery(params: any): Observable<DbQuery>;
  abstract initDbQuery(): Subscription;

  initParams(): Subscription {
    return this.routeService.getParams(this).subscribe((params) => {
      // TODO: parentsId 처리 필요
      console.log('params', params);
    });
  }

  initQueryParams(): Subscription {
    return this.routeService
      .getQueryParams(this)
      .pipe(switchMap((params) => this.setDbQuery(params)))
      .subscribe((query: DbQuery) => {
        this.dbQuery$.next(query);
      });
  }

  getList(query: DbQuery, options?: DbOptions): ListType {
    return this.service[this.methodName](query, options);
  }

  onIsLoading(): void {
    this.scrollPositionService.onIsLoading();
  }
  offIsLoading(): void {
    this.scrollPositionService.offIsLoading();
  }

  setDbQueryHistory(dbQuery: DbQuery): void {
    this.dbQueryHistory = dbQuery;
  }

  increaseCurrentPage(): void {
    this.currentPage += 1;
  }

  decreaseCurrentPage(): void {
    this.currentPage -= 1;
  }

  replaceQueryParams(addPrams: { [key: string]: any }) {
    return replaceQueryParams(addPrams);
  }

  protected getDbQueryAndDbOptions(): ColdObservableOnce<ListType> {
    return combineLatest([this.getDbQuery(), this.getDbOptions()]).pipe(
      map(([query, dbOptions]: [DbQuery, DbOptions]) =>
        this.getList(query, dbOptions)
      )
    );
  }

  protected getDbOptions(): ColdObservableOnce<DbOptions> {
    return this.routeService.getParams(this).pipe(
      map((params: any) => {
        if (params.id) {
          return {
            parentIds: [params.id],
          };
        } else {
          return undefined;
        }
      })
    );
  }

  protected getDbQuery(): ColdObservableOnce<DbQuery> {
    return this.dbQuery$.pipe(
      filter((query) => Boolean(query)),
      tap((dbQuery: DbQuery) => this.setDbQueryHistory(dbQuery)),
      tap(() => this.onIsLoading())
    );
  }
}
