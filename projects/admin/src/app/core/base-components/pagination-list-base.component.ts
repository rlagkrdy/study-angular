import { Directive, OnInit } from '@angular/core';
import { BaseEntity } from '../../../../../../src/core/base-entity';
import { PaginationList } from '../../../../../../src/core/types';
import { DbQuery, DbSortDirection } from '../../../../../../src/core/db/types';
import {
  SubscriptionBaseComponent
} from "../../../../../study-angular/src/lib/core/base-components/subscription/subscription-base.component";

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class PaginationListBaseComponent<E extends BaseEntity>
  extends SubscriptionBaseComponent
  implements OnInit
{
  paginationList: PaginationList<E>;
  totalCount: number;
  page: number;
  docs: E[];

  protected constructor(protected paginationFn: (dbQuery?: DbQuery) => PaginationList<E>) {
    super();
  }

  ngOnInit(): void {
    this.initDocs();
  }

  changePage(next: boolean): void {
    if (next) {
      this.paginationList.next();
    } else {
      this.paginationList.prev();
    }
  }

  protected initDocs(): void {
    const dbQuery: DbQuery = this.setDbQuery();
    this.paginationList = this.paginationFn(dbQuery);
    this.setPaginationProperty();
  }

  protected changeDocs(): void {
    this.setPaginationProperty();
  }

  private setPaginationProperty(): void {
    this.setObservable('total-count', 'totalCount', this.paginationList.totalCountChange);
    this.setObservable('page', 'page', this.paginationList.pageChange);
    this.setObservable('docs', 'docs', this.paginationList.valueChange);
  }

  protected setDbQuery(): DbQuery {
    return {
      sorts: [{ field: 'createdAt', direction: DbSortDirection.Desc }],
    };
  }
}
