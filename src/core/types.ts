import { Observable } from 'rxjs';

export interface Option<T = any> {
  text: string;
  value: T;
  disabled?: boolean;
}

export interface ObservableOnce<T> extends Observable<T> {}
export interface ColdObservable<T> extends Observable<T> {}
export interface ColdObservableOnce<T> extends Observable<T> {}
export interface HotObservable<T> extends Observable<T> {}
export interface HotObservableOnce<T> extends Observable<T> {}

export interface HashMap<T> {
  [id: string]: T;
}

export interface InfinityList<T = any> {
  valueChange: ColdObservable<T[]>;
  hasMoreChange: ColdObservable<boolean>;
  totalCount?: ColdObservableOnce<number>;
  more(limit?: number): HotObservableOnce<void>;
}

export interface PaginationList<T> {
  valueChange: ColdObservable<T[]>;
  totalCountChange?: ColdObservableOnce<number>;
  pageChange: ColdObservable<number>;
  prev(): ColdObservableOnce<number>;
  next(): ColdObservableOnce<number>;
  updatePage?(page: number): void;
}

export type InfinityListApiFn<R> = (page: number) => ColdObservableOnce<R>;
export type InfinityListResponseMapper<T, R> = (response: R) => InfinityListResponse<T>;

export interface InfinityListResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  perPage: number;
}

export interface Coord {
  lat: number;
  lng: number;
}

export interface TreeMap {
  [key: string]: TreeMap;
}
