import { BehaviorSubject, AsyncSubject, of } from 'rxjs';
import { switchMap, tap, map, take } from 'rxjs/operators';
import { InfinityList, HotObservableOnce } from '../types';
import { SearchAdapter } from './search.adapter';
import { SearchQuery } from './types';


export function makeSearchInfinityList<T>(
  searchAdapter: SearchAdapter,
  query: SearchQuery<T> = {}
): InfinityList<T> {
  let values = [];

  const hasMoreSubject = new BehaviorSubject<boolean>(false);
  const pageSubject = new BehaviorSubject<number>(query.page || 0);
  const totalCountSubject = new AsyncSubject<number>();

  let moreProcessing = false;

  return {
    valueChange: pageSubject.asObservable().pipe(
      switchMap(p => searchAdapter.search({ ...query, page: p })),
      tap(response => {
        hasMoreSubject.next((response.page + 1) * response.perPage < response.totalCount);

        if (!totalCountSubject.closed) {
          totalCountSubject.next(response.totalCount);
          totalCountSubject.complete();
        }

        moreProcessing = false;
      }),
      map(response => {
        values = values.concat(response.hits);
        return values;
      }),
    ),
    hasMoreChange: hasMoreSubject.asObservable(),
    totalCount: totalCountSubject.asObservable(),
    more(): HotObservableOnce<void> {
      if (moreProcessing || !hasMoreSubject.getValue()) {
        return of(null);
      }

      moreProcessing = true;
      pageSubject.next(pageSubject.getValue() + 1);

      return hasMoreSubject.asObservable().pipe(
        take(1),
        map(() => {})
      );
    }
  };
}

export function makeEmptySearchInfinityList(): InfinityList {
  return {
    valueChange: of([]),
    hasMoreChange: of(false),
    totalCount: of(0),
    more(): HotObservableOnce<void> {
      return of(null);
    }
  };
}
