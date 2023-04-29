import { OnInit, Directive } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseEntity } from '../../../../../../src/core/base-entity';
import { InfinityList } from '../../../../../../src/core/types';
import {
  SubscriptionBaseComponent
} from "../../../../../study-angular/src/lib/core/base-components/subscription/subscription-base.component";


@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class InfinityListBaseComponent<E extends BaseEntity>
  extends SubscriptionBaseComponent
  implements OnInit
{
  infinityList: InfinityList<E>;
  docs: E[];
  hasMore: boolean;

  isLoading = true;

  protected constructor(protected infinityListFn: () => InfinityList<E>) {
    super();
  }

  ngOnInit(): void {
    this.initDocs();
  }

  more(): void {
    if (this.infinityList) {
      this.isLoading = true;
      this.infinityList.more();
    }
  }

  private initDocs(): void {
    this.infinityList = this.infinityListFn();

    this.setObservable('has-more', 'hasMore', this.infinityList.hasMoreChange);
    this.setObservable(
      'docs',
      'docs',
      this.infinityList.valueChange.pipe(tap(() => (this.isLoading = false)))
    );
  }
}
