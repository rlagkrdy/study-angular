import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { partition, Subscription } from 'rxjs';
import { finalize, tap, switchMap, filter } from 'rxjs/operators';
import { BaseEntity } from '../../../../../../src/core/base-entity';
import { NotifierAdapter } from '../../../../../../src/core/notifier/notifier-adapter';
import { ColdObservableOnce } from '../../../../../../src/core/types';
import {
  SubscriptionBaseComponent
} from "../../../../../study-angular/src/lib/core/base-components/subscription/subscription-base.component";

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ModifyBaseComponent<E extends BaseEntity>
  extends SubscriptionBaseComponent
  implements OnInit
{
  doc: E;
  formValue: Partial<E>;

  invalid = true;
  isLoading = false;

  protected constructor(
    protected route: ActivatedRoute,
    protected service: {
      getFn: (id: string) => ColdObservableOnce<E>;
      updateFn?: (id: string, update: Partial<E>) => ColdObservableOnce<void>;
      deleteFn?: (id: string) => ColdObservableOnce<void>;
    },
    protected notifier: NotifierAdapter
  ) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(this.initDoc());
  }

  modify(mgs?: string): void {
    if (this.invalid) {
      this.notifier.warning('모든 정보를 입력해 주세요');
      return;
    }

    const doc = this.makeDoc(this.formValue);

    this.isLoading = true;

    this.service
      .updateFn(this.doc.id, doc)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          this.notifier.success(mgs || '수정하였습니다!');
          this.onCompleted();
        },
        (err) => {
          this.notifier.error(err.message, err);
        }
      );
  }

  delete(): void {
    const [confirmed$] = partition(this.notifier.confirm('정말 삭제하시겠습니까?'), Boolean);

    confirmed$
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() => this.service.deleteFn(this.doc.id)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        () => {
          this.notifier.success('삭제하였습니다!');
          this.onCompleted();
        },
        (err) => {
          this.notifier.error(err.message, err);
        }
      );
  }

  protected onCompleted?(): void;
  protected afterInitDoc?(): void;

  protected initDoc(): Subscription {
    return this.route.params
      .pipe(
        filter((params) => Boolean(params['id'])),
        switchMap((params) => this.service.getFn(params['id']))
      )
      .subscribe((doc) => {
        this.doc = doc;

        if (this.afterInitDoc) {
          this.afterInitDoc();
        }
      });
  }

  protected makeDoc(formValue: Partial<E>): Partial<E> {
    return formValue;
  }
}
