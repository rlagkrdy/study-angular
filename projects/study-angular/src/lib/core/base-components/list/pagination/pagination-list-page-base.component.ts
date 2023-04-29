import { Directive } from '@angular/core';
import { BaseEntity } from '../../../../../../../../src/core/base-entity';
import { NgRouteService } from '../../../services/route.service';
import { Observable, Subscription, tap } from 'rxjs';
import {
  DbListResponse,
  DbQuery,
  DbSortDirection,
} from '../../../../../../../../src/core/db/types';
import { map } from 'rxjs/operators';
import { ColdObservableOnce, PaginationList } from '../../../types';
import { ScrollPositionService } from '../../../services/scroll-position.service';
import { ListBaseComponent } from '../list-base.component';
import firebase from 'firebase/compat';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;

@Directive()
export abstract class PaginationListPageBaseComponent<
  E extends BaseEntity
> extends ListBaseComponent<PaginationList<E>, E> {
  paginationList: PaginationList<E>;

  override limit: number = 10;

  override defaultDbQuery: DbQuery = {
    limit: this.limit,
    sorts: [{ field: 'createdAt', direction: DbSortDirection.Desc }],
  };

  protected constructor(
    protected override routeService: NgRouteService,
    protected override scrollPositionService: ScrollPositionService,
    protected override service: any,
    protected override methodName: string = 'paginationList'
  ) {
    super(routeService, scrollPositionService, service, methodName);
  }

  abstract override setDbQuery(params: any): Observable<DbQuery>;

  initDbQuery(): Subscription {
    return this.getDbQueryAndDbOptions().subscribe(
      (paginationList: PaginationList<E>) => {
        this.paginationList = paginationList;

        this.setObservable(
          'list',
          'list',
          this.paginationList.valueChange.pipe(tap(() => this.offIsLoading()))
        );

        this.setObservable(
          'count',
          'count',
          this.paginationList.totalCountChange
        );
      }
    );
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.count / this.limit;
  }

  next(): void {
    this.increaseCurrentPage();

    const { lt, gt, arrow } = this.getPaginationHistory('next');

    this.onIsLoading();

    this.paginationList.next();

    this.replaceQueryParams({ page: this.currentPage, lt, gt, arrow });
  }

  prev(): void {
    this.decreaseCurrentPage();

    const { lt, gt, arrow } = this.getPaginationHistory('prev');

    this.onIsLoading();

    this.paginationList.prev();

    this.replaceQueryParams({ page: this.currentPage, lt, gt, arrow });
  }

  movePage(page: number): void {
    this.currentPage = page;

    this.onIsLoading();

    this.getTargetPageGt(page).subscribe((gt) => {
      this.dbQuery$.next({
        ...this.defaultDbQuery,
        limit: this.limit,
        gt,
      });

      this.replaceQueryParams({
        page: this.currentPage,
        lt: null,
        gt: null,
        arrow: 'move',
      });
    });
  }

  getPaginationHistory(arrow: 'next' | 'prev') {
    return {
      lt: this.list[0].id,
      gt: this.list[this.list.length - 1].id,
      arrow,
    };
  }

  getTargetPageGt(
    page: number
  ): ColdObservableOnce<DocumentSnapshot<DocumentData>> {
    return this.service
      .list({
        ...this.defaultDbQuery,
        limit: this.limit * (page - 1),
      })
      .pipe(map((response: DbListResponse<any>) => response.lastDoc));
  }

  getDocumentSnapShot(
    id: string
  ): ColdObservableOnce<DocumentSnapshot<DocumentData>> {
    return this.service.getDocumentSnapShot(id);
  }
}
