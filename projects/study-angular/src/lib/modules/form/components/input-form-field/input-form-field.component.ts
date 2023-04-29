import { Component, forwardRef, Input } from '@angular/core';
import { FormControlBaseComponent } from '../../../../core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-input-form-field',
  templateUrl: './input-form-field.component.html',
  styleUrls: ['./input-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFormFieldComponent),
      multi: true,
    },
  ],
})
export class InputFormFieldComponent extends FormControlBaseComponent {
  @Input() type = 'text';
  @Input() highlight = "false";
  constructor() {
    super();
  }
}
