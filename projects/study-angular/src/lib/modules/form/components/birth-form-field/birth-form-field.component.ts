import { Component, forwardRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lib-birth-form-field',
  templateUrl: './birth-form-field.component.html',
  styleUrls: ['./birth-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthFormFieldComponent),
      multi: true,
    },
  ],
})
export class BirthFormFieldComponent
  extends FormControlBaseComponent
  implements OnInit
{
  formGroup = this.createForm();

  yearOptions = this.createYearOption();
  monthOptions = this.createMonthOption();

  constructor(private fb: FormBuilder) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setSubscription('group-status-change', this.initGroupStatusChange());
  }

  initGroupStatusChange(): Subscription {
    return this.formGroup.statusChanges
      .pipe(filter((status) => status === 'VALID'))
      .subscribe(() => {
        const { year, month } = this.formGroup.value;
        this.formCtrl.patchValue(`${year}-${month}`);
      });
  }

  protected override resetControl(value: string): void {
    if (value) {
      const [year, month] = value.split('-');

      this.formCtrl.setValue(value, { emitEvent: false });
      this.formGroup.setValue({ year, month }, { emitEvent: true });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      year: ['2000', Validators.required],
      month: ['', Validators.required],
    });
  }

  private createYearOption() {
    const yearOptions = [];
    const today = new Date();

    const year = today.getFullYear(); // 년도
    for (let i = 1940; i <= year; i++) {
      yearOptions.push(i + '');
    }
    return yearOptions;
  }

  private createMonthOption() {
    const monthOptions = [];
    for (let i = 1; i <= 12; i++) {
      monthOptions.push(i < 10 ? '0' + i : i);
    }
    return monthOptions;
  }
}
