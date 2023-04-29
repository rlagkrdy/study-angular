import { Directive } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BaseEntity } from '../../../../../../src/core/base-entity';
import { NotifierAdapter } from '../../../../../../src/core/notifier/notifier-adapter';
import { HotObservableOnce } from '../../../../../../src/core/types';
import {
  SubscriptionBaseComponent
} from "../../../../../study-angular/src/lib/core/base-components/subscription/subscription-base.component";


@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AddBaseComponent<
  E extends BaseEntity
> extends SubscriptionBaseComponent {
  formValue: Partial<E>;

  invalid = true;
  isLoading = false;

  protected constructor(
    protected addFn: (doc: Partial<E>) => HotObservableOnce<E>,
    protected notifier: NotifierAdapter
  ) {
    super();
  }

  add(): void {
    if (this.invalid) {
      this.notifier.warning('모든 정보를 입력해 주세요');
      return;
    }

    const doc = this.makeDoc(this.formValue);

    this.isLoading = true;

    this.addFn(doc)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          this.notifier.success('추가하였습니다!');
          this.onCompleted();
        },
        (err) => {
          this.notifier.error(err.message, err);
        }
      );
  }

  protected onCompleted?(): void;

  protected makeDoc(formValue: Partial<E>): Partial<E> {
    return formValue;
  }
}
