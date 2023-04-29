import { DbQuery } from '../../../../../../../src/core/db/types';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

export interface LibClientList<ListType, E> {
  list: E[];
  count: number;
  dbQuery$: BehaviorSubject<DbQuery>;
  dbQueryHistory: DbQuery;
  isLoading: boolean;

  setDbQuery(params: any): Observable<DbQuery>;
  initQueryParams(): Subscription;
  initDbQuery(): Subscription;
  getList(query: DbQuery): ListType;
  onIsLoading(): void;
  offIsLoading(): void;
  setDbQueryHistory(dbQuery: DbQuery): void;
}
