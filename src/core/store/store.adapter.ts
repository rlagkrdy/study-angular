import { Observable } from 'rxjs';


export interface StoreAdapter<S = any> {
  reset(): void;

  update(state: Partial<S>): void;

  select(): Observable<S>;
  select<K extends keyof S>(key: K): Observable<S[K]>;
  select<R>(project: (store: S) => R): Observable<R>;

  getValue(): S;
}
