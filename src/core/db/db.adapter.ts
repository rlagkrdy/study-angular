import { BaseEntity } from '../base-entity';
import { ColdObservable, ColdObservableOnce, HotObservableOnce, ObservableOnce, PaginationList, InfinityList } from '../types';
import { DbQuery, DbOptions, DbListResponse, DbBatchItems } from './types';
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;

export interface DbAdapter<E extends BaseEntity> {
  getDocumentSnapShot(id: string, options?: DbOptions): ColdObservableOnce<DocumentSnapshot<DocumentData>>;
  get(id: string, options?: DbOptions): ColdObservableOnce<E>;
  getChange?(id: string, options?: DbOptions): ColdObservable<E>;
  getMany?(ids: string[], options?: DbOptions): ColdObservableOnce<E[]>;
  getManyChange?(ids: string[], options?: DbOptions): ColdObservable<E[]>;
  list(query?: DbQuery, options?: DbOptions): ColdObservableOnce<DbListResponse<E>>;
  listChange?(query?: DbQuery, options?: DbOptions): ColdObservable<DbListResponse<E>>;
  paginationList?(query?: DbQuery, options?: DbOptions): PaginationList<E>;
  infinityList(query?: DbQuery, options?: DbOptions): InfinityList<E>;
  count(query?: DbQuery, options?: DbOptions): ColdObservableOnce<number>;
  countIncrease?(field: string, increase: number, options?: DbOptions): HotObservableOnce<void>;
  countDecrease?(field: string, decrease: number, options?: DbOptions): HotObservableOnce<void>;
  add(entity: Partial<E>, options?: DbOptions): HotObservableOnce<E>;
  update(id: string, update: Partial<E>, options?: DbOptions): HotObservableOnce<void>;
  increase?(id: string, field: keyof E, increase: number, options?: DbOptions): HotObservableOnce<void>;
  decrease?(id: string, field: keyof E, decrease: number, options?: DbOptions): HotObservableOnce<void>;
  upsert?(id: string, entity: Partial<E>, options?: DbOptions): HotObservableOnce<E>;
  delete(id: string, options?: DbOptions): HotObservableOnce<void>;
  batch?(batch: DbBatchItems, options?: DbOptions): HotObservableOnce<void>;
  transaction?(...args: any): ObservableOnce<any>;
}
