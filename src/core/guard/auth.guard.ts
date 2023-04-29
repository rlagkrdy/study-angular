import { Injectable, NgZone } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { ColdObservableOnce } from '../types';
import { NgAuthService } from '../../../projects/pet-castle/src/lib/db/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private authService: NgAuthService,
    private ngZone: NgZone
  ) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoggedIn().pipe(rezone(this.ngZone));
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route);
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoggedIn().pipe(rezone(this.ngZone));
  }

  checkLoggedIn(): ColdObservableOnce<boolean> {
    return this.authService.state$.pipe(
      first((state) => state.authLoaded),
      map((state) => state.isLoggedIn),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/auth/login').then();
          });
        }
      })
    );
  }
}

const rezone =
  (zone: NgZone) =>
  <T>(source: Observable<T>) =>
    new Observable<T>((observer) =>
      source.subscribe({
        next: (v) => zone.run(() => observer.next(v)),
        error: (e) => zone.run(() => observer.error(e)),
        complete: () => zone.run(() => observer.complete()),
      })
    );
