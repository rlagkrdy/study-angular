import { Directive, OnInit } from '@angular/core';
import { BaseEntity } from '../../../../../../../../src/core/base-entity';
import { NgRouteService } from '../../../services/route.service';
import { Observable, Subscription, tap } from 'rxjs';
import {
  DbQuery,
} from '../../../../../../../../src/core/db/types';
import { debounceTime, filter } from 'rxjs/operators';
import { ScrollPositionService } from '../../../services/scroll-position.service';
import { ScrollService } from '../../../services/scroll.service';
import { InfinityListBaseComponent } from './infinity-list-base.component';

@Directive()
export abstract class ScrollInfinityListPageBaseComponent<E extends BaseEntity>
  extends InfinityListBaseComponent<E>
  implements OnInit
{
  protected constructor(
    protected override routeService: NgRouteService,
    protected override scrollPositionService: ScrollPositionService,
    protected override service: any,
    protected scrollService: ScrollService,
    protected override methodName: string = 'infinityList'
  ) {
    super(routeService, scrollPositionService, service, methodName);
  }

  abstract override setDbQuery(params: any): Observable<DbQuery>;

  override ngOnInit() {
    super.ngOnInit();
    this.setSubscription('initOnScrollEnd', this.initOnScrollEnd());
  }

  private initOnScrollEnd(): Subscription {
    return this.scrollService
      .scrollEnd()
      .pipe(
        filter(() => this.hasMore),
        tap(() => this.onIsLoading()),
        debounceTime(1000)
      )
      .subscribe(() => {
        this.more();
      });
  }
}
