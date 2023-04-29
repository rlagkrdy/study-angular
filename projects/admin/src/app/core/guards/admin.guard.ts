import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { NgAuthService } from '../../../../../dn-accountant/src/lib/db/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: NgAuthService, private router: Router) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdmin();
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdmin();
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdmin();
  }

  checkAdmin() {
    return this.authService.state$.pipe(
      first((state) => state.dbLoaded),
      map((state) => state.user.isAdmin),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.authService.logout();
          this.router.navigateByUrl('/auth');
          throw new Error('access denied!');
        }
      })
    );
  }
}
