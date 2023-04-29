import { HashMap, ColdObservable } from '../types';
import { StoreAdapter } from './store.adapter';

export interface EntityState<E = any> {
  entities?: HashMap<E>;
  ids?: string[];
  [key: string]: any;
}

export interface EntityStoreAdapter<S = any, E = any> extends StoreAdapter {
  addEntity(entities: E | E[]): void;
  updateEntity(id: string, entity: Partial<E>): void;
  upsertEntity(id: string, entity: E): void;
  deleteEntity(id: string): void;
  moveEntity(fromIndex: number, toIndex: number): void;

  selectAll(): ColdObservable<E[]>;
  getAll(): E[];
  selectEntity(id: string): ColdObservable<E>;
  getEntity(id): E;
  selectMany(ids: string[]): ColdObservable<E[]>;
  getMany(ids: string[]): E[];
  selectCount(predicate?: (entity: E, index: number) => boolean): ColdObservable<number>;
  getCount(predicate?: (entity: E, index: number) => boolean): number;
  hasEntity(id): boolean;
}
