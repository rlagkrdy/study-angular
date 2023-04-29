import { Directive } from '@angular/core';
import { BaseEntity } from '../../../../../../../../src/core/base-entity';
import { NgRouteService } from '../../../services/route.service';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { ColdObservableOnce } from '../../../../../../../../src/core/types';
import {
  DbListResponse,
  DbQuery,
} from '../../../../../../../../src/core/db/types';
import { filter } from 'rxjs/operators';
import { ScrollPositionService } from '../../../services/scroll-position.service';
import { ListBaseComponent } from '../list-base.component';

@Directive()
export abstract class NormalListPageBaseComponent<
  E extends BaseEntity
> extends ListBaseComponent<ColdObservableOnce<DbListResponse<E>>, E> {
  protected constructor(
    protected override routeService: NgRouteService,
    protected override scrollPositionService: ScrollPositionService,
    protected override service: any,
    protected override methodName: string = 'list'
  ) {
    super(routeService, scrollPositionService, service, methodName);
  }

  abstract override setDbQuery(params: any): Observable<DbQuery>;

  initDbQuery(): Subscription {
    return this.dbQuery$
      .pipe(
        filter((query) => Boolean(query)),
        tap((dbQuery: DbQuery) => this.setDbQueryHistory(dbQuery)),
        tap(() => this.onIsLoading()),
        switchMap((query: DbQuery) => this.getList(query))
      )
      .subscribe((response: DbListResponse<E>) => {
        console.log('response', response);
        this.list = response.docs;
        this.count = response.count;

        this.offIsLoading();
      });
  }
}
