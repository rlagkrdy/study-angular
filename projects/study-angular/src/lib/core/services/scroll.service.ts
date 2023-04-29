import { Injectable, NgZone } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { filter, map, throttleTime, tap, switchMap, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollPos = 0;
  constructor(private ngZone: NgZone) {}

  init(): Observable<Event> {
    return this.ngZone.runOutsideAngular(() => {
      return fromEvent(window, 'scroll');
    });
  }

  indexScrollHandler(isIndex$: Observable<boolean>) {
    return this.init().pipe(
      switchMap(() => isIndex$),
      filter((isIndex) => Boolean(isIndex)),
      debounceTime(25),
      map(() => this.getScrollDirection()),
      tap(() => this.setScrollPos()),
      map((direction: 'UP' | 'DOWN') => {
        if (direction === 'UP' && window.scrollY < 45) {
          return false;
        } else if (direction === 'DOWN' && window.scrollY > 45) {
          return true;
        } else {
          return null;
        }
      })
    );
  }

  scrollEnd(): Observable<string> {
    return this.init().pipe(
      filter((event: Event) => this.isWindowScrollEnd(event)),
      map(() => this.getScrollDirection()),
      tap(() => this.setScrollPos()),
      filter((direction) => direction === 'DOWN'),
      throttleTime(250)
    );
  }

  private isWindowScrollEnd(event: any): boolean {
    const scrollTop =
      window.pageYOffset ||
      event.target.documentElement.scrollTop ||
      event.target.body.scrollTop ||
      0;

    const screenHeight = window.innerHeight;
    const bodyHeight = event.target.body.clientHeight;

    return bodyHeight - 200 < scrollTop + screenHeight;
  }

  private getScrollDirection(): 'UP' | 'DOWN' {
    return window.scrollY < this.scrollPos ? 'UP' : 'DOWN';
  }

  private setScrollPos(): void {
    this.scrollPos = window.scrollY;
  }
}
