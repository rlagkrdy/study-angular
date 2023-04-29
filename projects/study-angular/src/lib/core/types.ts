import { Observable } from 'rxjs';

export interface Option<T = any> {
  text: string;
  value: T;
  disabled?: boolean;
  type?: string;
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
  more(): HotObservableOnce<void>;
}

export interface PaginationList<T> {
  valueChange: ColdObservable<T[]>;
  totalCountChange?: ColdObservableOnce<number>;
  pageChange: ColdObservable<number>;
  prev(): ColdObservableOnce<number>;
  next(): ColdObservableOnce<number>;
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

export interface WndImage {
  ratio: string;
  paddingTop: string;
  thumbnail: string;
  origin: string;
  multiple?: string;
  originWebp?: string;
  multipleWebp?: string;
  original?: string; // 원본 이미지
}
export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface Writer {
  id: string;
  email: string;
  name: string;
  author: string;
  profileImage: string;
}

export interface File {
  fileSize?: string;
  fileName: string;
  url: string;
}

export interface SizeOptions {
  type: 'thumbnail' | 'origin' | 'multiple' | 'originWebp' | 'multipleWebp';
  width?: number;
  height?: number;
  dir: string;
  fileName: string;
  format?: 'jpg' | 'webp';
}

export interface WeenidyResizeImageOptions {
  width?: number;
  height?: number;
  dir?: string;
  fileName?: string;
  twice?: boolean;
}

export type WndRatio =
  | '1-1'
  | '2-1'
  | '4-1'
  | '3_75-1'
  | '3-2'
  | '3-4'
  | '4-3'
  | '5-7'
  | '6_4-1'
  | '9-16'
  | '16-9'
  | '33-5';

export interface BannerItem {
  image: string;
  mobileImage: string;
  link?: string;
}

export interface MainBannerItem {
  pcLink: string;
  pcTitleEn: string;
  pcTitle: string;
  pcContent: string;
  pcImage: string;
  mobLink: string;
  mobTitleEn: string;
  mobTitleFirst: string;
  mobTitleSecond: string;
  mobContent: string;
  mobImage: string;
}

export interface FileExtension {
  type: string;
  count: number;
}

export interface File {
  fileSize?: string;
  fileName: string;
  url: string;
}
