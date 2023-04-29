import { Directive } from '@angular/core';
import { BaseEntity } from '../../../../../../../../src/core/base-entity';
import { NgRouteService } from '../../../services/route.service';
import { Observable } from 'rxjs';
import { DbQuery } from '../../../../../../../../src/core/db/types';
import { ScrollPositionService } from '../../../services/scroll-position.service';
import { InfinityListBaseComponent } from './infinity-list-base.component';

@Directive()
export abstract class MoreInfinityListPageBaseComponent<
  E extends BaseEntity
> extends InfinityListBaseComponent<E> {
  protected constructor(
    protected override routeService: NgRouteService,
    protected override scrollPositionService: ScrollPositionService,
    protected override service: any,
    protected override methodName: string = 'infinityList'
  ) {
    super(routeService, scrollPositionService, service, methodName);
  }

  abstract override setDbQuery(params: any): Observable<DbQuery>;
}
