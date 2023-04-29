import { Directive, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { BaseEntity } from '../../../../../../../../src/core/base-entity';
import { ListBaseComponent } from '../list-base.component';
import { InfinityList } from '../../../types';
import {
  DbQuery,
  DbSortDirection,
} from '../../../../../../../../src/core/db/types';
import { NgRouteService } from '../../../services/route.service';
import { ScrollPositionService } from '../../../services/scroll-position.service';

@Directive()
export abstract class InfinityListBaseComponent<E extends BaseEntity>
  extends ListBaseComponent<InfinityList<E>, E>
  implements OnInit
{
  infinityList: InfinityList<E>;
  hasMore: boolean;

  override limit: number = 10;

  override defaultDbQuery: DbQuery = {
    limit: this.limit,
    sorts: [{ field: 'createdAt', direction: DbSortDirection.Desc }],
  };

  protected constructor(
    protected override routeService: NgRouteService,
    protected override scrollPositionService: ScrollPositionService,
    protected override service: any,
    protected override methodName: string = 'infinityList'
  ) {
    super(routeService, scrollPositionService, service, methodName);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  abstract override setDbQuery(params: any): Observable<DbQuery>;

  initDbQuery(): Subscription {
    return this.getDbQueryAndDbOptions().subscribe(
      (infinityList: InfinityList<E>) => {
        this.infinityList = infinityList;

        this.setObservable(
          'list',
          'list',
          this.infinityList.valueChange.pipe(tap(() => this.offIsLoading()))
        );

        this.setObservable(
          'hasMore',
          'hasMore',
          this.infinityList.hasMoreChange
        );
      }
    );
  }

  more(): void {
    this.onIsLoading();

    this.increaseCurrentPage();

    this.replaceQueryParams({ page: this.currentPage });

    this.infinityList.more(this.limit);
  }
}
