import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';

@Component({
  selector: 'lib-holiday-form-field',
  templateUrl: './holiday-form-field.component.html',
  styleUrls: ['./holiday-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HolidayFormFieldComponent),
      multi: true,
    },
  ],
})
export class HolidayFormFieldComponent extends FormControlBaseComponent {
  holidays = [
    '없음',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
    '공휴일',
  ];

  constructor() {
    super();
  }

  toggle(holiday: string): void {
    const value = this.formCtrl.value;

    if (value.indexOf(holiday) === -1) {
      this.formCtrl.setValue([...value, holiday]);
    } else {
      this.formCtrl.setValue(value.filter((item) => item !== holiday));
    }

    console.log(this.formCtrl.value);
  }

  isActive(holiday: string): boolean {
    const value = this.formCtrl.value;

    return value.indexOf(holiday) !== -1;
  }
}
