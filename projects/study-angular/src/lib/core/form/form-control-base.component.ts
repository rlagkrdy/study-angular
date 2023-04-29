import { OnInit, Input, EventEmitter, Output, Directive } from '@angular/core';
import {
  FormControl,
  ValidatorFn,
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlValueAccessor,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { delayMicrotask } from '../../../../../../src/core/utils';
import { SubscriptionBaseComponent } from '../base-components/subscription/subscription-base.component';

@Directive()
export abstract class FormControlBaseComponent<T = any, C = any>
  extends SubscriptionBaseComponent
  implements OnInit, ControlValueAccessor
{
  @Input() useLabel = true;
  @Input() labelFor: string = '';
  @Input() label: string = '';
  @Input() placeholder = '';

  @Input()
  get value(): T {
    return this._value;
  }

  set value(value: T) {
    if (value && value !== this._value) {
      this.resetControl(this.convertToControlValue(value));
    }
  }

  protected _value: T;

  @Output() valueChange = new EventEmitter<T>();
  @Output() invalidChange = new EventEmitter<boolean>();

  formCtrl: FormControl;

  protected onChange: any = () => {};
  onTouch: any = () => {};

  protected constructor(
    protected formState?: any,
    protected validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    protected asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super();

    this.formCtrl = new FormControl(formState, validatorOrOpts, asyncValidator);
  }

  ngOnInit(): void {
    this.setSubscription('value-change', this.initValueChange());
    this.setSubscription('status-change', this.initStatusChange());
    this.invalidChange.emit(this.formCtrl.invalid);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formCtrl.disable() : this.formCtrl.enable();
  }

  writeValue(value: T): void {
    this.resetControl(this.convertToControlValue(value));
  }

  protected initValueChange(): Subscription {
    return this.formCtrl.valueChanges.subscribe((value) => {
      delayMicrotask(() => {
        if (this.checkValidValue(value)) {
          this.emit(this.convertToEmitValue(value));
        }
      });
    });
  }

  protected initStatusChange(): Subscription {
    return this.formCtrl.statusChanges.subscribe((status) => {
      delayMicrotask(() => {
        this.invalidChange.emit(status !== 'VALID');
      });
    });
  }

  protected resetControl(value: C): void {
    this.formCtrl.setValue(value, { emitEvent: false });
  }

  protected emit(value: T): void {
    this._value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected convertToEmitValue(value: C): T {
    return value as unknown as T;
  }

  protected convertToControlValue(value: T): C {
    return value as unknown as C;
  }

  protected checkValidValue(value: C): boolean {
    return true;
  }
}
