import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { filter, map, switchMap } from "rxjs/operators";
import {
  ColdObservable,
  ColdObservableOnce,
} from "../../../../../../src/core/types";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class NgRouteService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  getParams(component: any): ColdObservable<any> {
    const route = this.findRoute(component, this.route);

    return route.params;
  }

  getSnapshotParams(component: any): any {
    const route = this.findRoute(component, this.route);

    return route.snapshot.params;
  }

  getParam(component: any, param: string = "id"): ColdObservable<string> {
    return this.getParams(component).pipe(
      map((params) => params[param]),
      filter<string>(Boolean)
    );
  }

  getQueryParams(component: any): ColdObservable<any> {
    const route = this.findRoute(component, this.route);

    return route.queryParams;
  }

  getSnapshotQueryParams(component: any): any {
    const route = this.findRoute(component, this.route);

    return route.snapshot.queryParams;
  }

  getQueryParam(component: any, param: string): ColdObservable<string> {
    return this.getQueryParams(component).pipe(
      map((params) => params[param]),
      filter<string>(Boolean)
    );
  }

  getData(component: any): ColdObservable<any> {
    const route = this.findRoute(component, this.route);

    return route.data;
  }

  getEntity<E, T = any>(
    component: any,
    service: T,
    method: keyof T,
    param: string = "id"
  ): ColdObservableOnce<E> {
    return this.getParam(component, param).pipe(
      switchMap((id) => (service as any)[method](id))
    ) as ColdObservableOnce<E>;
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  back(): void {
    this.location.back();
  }

  private findRoute(component: any, route: ActivatedRoute) {
    if (route.component) {
      if (component instanceof (route as any).component) {
        return route;
      }
    }

    if (route.children.length) {
      for (const childRoute of route.children) {
        const foundRoute = this.findRoute(component, childRoute);

        if (foundRoute) {
          return foundRoute;
        }
      }
    } else {
      return null;
    }
  }
}
