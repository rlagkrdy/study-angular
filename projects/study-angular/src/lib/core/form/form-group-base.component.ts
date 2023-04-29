import {
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Directive,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { delayMicrotask } from '../../../../../../src/core/utils';
import { SubscriptionBaseComponent } from '../base-components/subscription/subscription-base.component';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class FormGroupBaseComponent<T = any, F = any>
  extends SubscriptionBaseComponent
  implements AfterContentInit
{
  @Input()
  get doc(): T {
    return this._doc;
  }

  set doc(doc: T) {
    this._doc = doc;
    this.value = doc;
  }

  protected _doc: T;

  @Input()
  set value(value: T) {
    if (value && value !== this._value) {
      this.resetForm(this.convertToFormValue(value));
    }
  }

  protected _value: T;

  @Output() valueChange = new EventEmitter<T>();
  @Output() statusChange = new EventEmitter<any>();
  @Output() invalidChange = new EventEmitter<boolean>();

  formGroup: FormGroup;

  protected constructor(formGroup?: FormGroup) {
    super();

    if (formGroup) {
      this.formGroup = formGroup;
    }
  }

  ngAfterContentInit(): void {
    this.setSubscription('value-change', this.initValueChange());
    this.setSubscription('status-change', this.initStatusChange());
    delayMicrotask(() => {
      this.formGroup.updateValueAndValidity();
    });
  }

  protected initValueChange(): Subscription {
    return this.formGroup.valueChanges
      .pipe(
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((value) => {
        delayMicrotask(() => {
          if (this.checkValidValue(value)) {
            this.emit(this.convertToEmitValue(value));
          }
        });
      });
  }

  protected initStatusChange(): Subscription {
    return this.formGroup.statusChanges.subscribe((status) => {
      delayMicrotask(() => {
        this.statusChange.emit(status);
        this.invalidChange.emit(status !== 'VALID');
      });
    });
  }

  protected resetForm(value: F): void {
    if (value) {
      this.formGroup.reset(value);
    }
  }

  protected emit(value: T): void {
    this._value = value;
    this.valueChange.emit(value);
  }

  protected convertToEmitValue(value: F): T {
    return value as unknown as T;
  }

  protected convertToFormValue(value: T): F {
    return value as unknown as F;
  }

  protected checkValidValue(value: F): boolean {
    return true;
  }
}
