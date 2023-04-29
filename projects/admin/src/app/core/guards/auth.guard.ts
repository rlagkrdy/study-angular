import { Injectable } from '@angular/core';
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
import { ColdObservableOnce } from '../../../../../../src/core/types';
import { NgAuthService } from '../../../../../study-angular/src/lib/db/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authService: NgAuthService) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoggedIn();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route);
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoggedIn();
  }

  checkLoggedIn(): ColdObservableOnce<boolean> {
    return this.authService.state$.pipe(
      first((state) => state.authLoaded),
      map((state) => state.isLoggedIn),
      tap((isLoggedIn) => {
        console.log('isLoggedIn', isLoggedIn);
        if (!isLoggedIn) {
          this.router.navigateByUrl('/auth');
          throw new Error('access denied!');
        }
      })
    );
  }
}
