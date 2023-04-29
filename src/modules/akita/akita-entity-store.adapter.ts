import { EntityStore, QueryEntity } from '@datorama/akita';
import { EntityStoreAdapter, EntityState } from '../../core/store/entity-store.adapter';
import { ColdObservable } from '../../core/types';
import { AkitaStoreAdapter } from './akita-store.adapter';


export class AkitaEntityStoreAdapter<S extends EntityState, E = any> extends AkitaStoreAdapter<S> implements EntityStoreAdapter {
  constructor(
    protected akitaStore: EntityStore<S, E>,
    protected akitaQuery: QueryEntity<S, E>
  ) {
    super(akitaStore, akitaQuery);
  }

  addEntity(entityOrEntities: E | E[]): void {
    this.akitaStore.add(entityOrEntities);
  }

  updateEntity(id: string, entity: Partial<E>): void {
    this.akitaStore.update(id as any, entity);
  }

  upsertEntity(id: string, entity: E): void {
    this.akitaStore.upsert(id as any, entity);
  }

  deleteEntity(id: string): void {
    this.akitaStore.remove(id as any);
  }

  moveEntity(fromIndex: number, toIndex: number): void {
    this.akitaStore.move(fromIndex, toIndex);
  }

  selectAll(): ColdObservable<E[]> {
    return this.akitaQuery.selectAll();
  }

  getAll(): E[] {
    return this.akitaQuery.getAll();
  }

  selectEntity(id: string): ColdObservable<E> {
    return this.akitaQuery.selectEntity(id as any);
  }

  getEntity(id): E {
    return this.akitaQuery.getEntity(id as any);
  }

  selectMany(ids: string[]): ColdObservable<E[]> {
    return this.akitaQuery.selectMany(ids as any);
  }

  getMany(ids: string[]): E[] {
    const entities = this.akitaQuery.getValue().entities;

    return ids.map(id => entities[id]);
  }

  selectCount(predicate?: (entity: E, index: number) => boolean): ColdObservable<number> {
    return this.akitaQuery.selectCount(predicate);
  }

  getCount(predicate?: (entity: E, index: number) => boolean): number {
    return this.akitaQuery.getCount(predicate);
  }

  hasEntity(id: string): boolean {
    return this.akitaQuery.hasEntity(id as any);
  }
}
