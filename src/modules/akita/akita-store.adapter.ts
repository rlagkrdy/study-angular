import { Store, Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { StoreAdapter } from '../../core/store/store.adapter';


export class AkitaStoreAdapter<S> implements StoreAdapter {
  constructor(
    protected akitaStore: Store<S>,
    protected akitaQuery: Query<S>
  ) {}

  reset(): void {
    this.akitaStore.reset();
  }

  update(state: Partial<S>): void {
    this.akitaStore.update(state);
  }

  getValue(): S {
    return this.akitaQuery.getValue();
  }

  select(): Observable<any>;
  select<K extends keyof any>(key: K): Observable<any[K]>;
  select<R>(project: (store: any) => R): Observable<R>;
  select(key?): any {
    return this.akitaQuery.select(key);
  }
}
