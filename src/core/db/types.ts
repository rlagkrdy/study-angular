export type DbFilterComparison = '>' | '>=' | '==' | '<=' | '<' | '!=' | 'array-contains' | 'text';

export interface DbQuery<E = any> {
  filters?: DbFilter<E>[];
  sorts?: DbSort<E>[];
  lt?: any;
  gt?: any;
  limit?: number;
}

export interface DbSort<E = any> {
  field: DbField<E>;
  direction: DbSortDirection;
}

export enum DbSortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export interface DbFilter<E = any> {
  field: DbField<E>;
  comparison: DbFilterComparison;
  logical?: 'and' | 'or';
  value: any;
}

export type DbField<E> = keyof E & string;

export interface DbListResponse<E> {
  docs: E[];
  totalCount: number;
  count: number;
  firstDoc: any;
  lastDoc: any;
}

export interface DbOptions {
  parentIds?: string[];
}

export interface DbBatchItems<E = any> {
  set?: DbBatchSet<E>[];
  update?: DbBatchUpdate<E>[];
  delete?: DbBatchDelete<E>[];
}

export interface DbBatchSet<E> {
  id: string;
  data: E;
}

export interface DbBatchUpdate<E> {
  id: string;
  data: Partial<E>;
}

export interface DbBatchDelete<E> {
  id: string;
}
