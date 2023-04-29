import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';

@Component({
  selector: 'lib-date-picker-form-field',
  templateUrl: './date-picker-form-field.component.html',
  styleUrls: ['./date-picker-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerFormFieldComponent),
      multi: true,
    },
  ],
})
export class DatePickerFormFieldComponent extends FormControlBaseComponent {
  constructor() {
    super();
  }
}
