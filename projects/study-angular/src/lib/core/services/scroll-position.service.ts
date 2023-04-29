import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  skipWhile,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  onLoadingOnce$ = this.isLoading$.pipe(
    skipWhile((isLoading) => Boolean(isLoading)),
    take(1)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  init(): Subscription {
    let position;
    return this.router.events
      .pipe(
        filter((event: Scroll) => event instanceof Scroll),
        filter((e: Scroll) => Boolean(e.position)),
        tap((e: Scroll) => (position = e.position)),
        switchMap(() => this.onLoadingOnce$)
      )
      .subscribe(() => {
        console.log('position', position);
        this.scrollToPosition(position);
      });
  }

  onIsLoading(): void {
    this.isLoading$.next(true);
  }

  offIsLoading(): void {
    this.isLoading$.next(false);
  }

  private getQueryParamsPosition(): [number, number] {
    const x = this.route.snapshot.queryParams['scrollX'];
    const y = this.route.snapshot.queryParams['scrollY'];

    if (!x || !y) {
      return undefined;
    }

    return [Number(x), Number(y)];
  }

  private updatePositionOnQueryParams(position: [number, number]): void {
    const [scrollX, scrollY] = position;

    const queryParams = new URLSearchParams(window.location.search);

    this.router
      .navigate([], {
        queryParams: {
          scrollX,
          scrollY,
        },
        relativeTo: this.route,
        replaceUrl: true,
        queryParamsHandling: 'merge',
      })
      .then();
  }

  private scrollToPosition(position: [number, number]): void {
    setTimeout(() => this.viewportScroller.scrollToPosition(position), 25);
  }
}
