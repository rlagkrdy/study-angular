import { Component, forwardRef } from '@angular/core';
import { FormControlBaseComponent } from '../../../../core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-checkbox-form-field',
  templateUrl: './checkbox-form-field.component.html',
  styleUrls: ['./checkbox-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxFormFieldComponent),
      multi: true,
    },
  ],
})
export class CheckboxFormFieldComponent extends FormControlBaseComponent {
  constructor() {
    super();
  }
}
