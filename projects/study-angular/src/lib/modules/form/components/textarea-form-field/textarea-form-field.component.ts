import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';

@Component({
  selector: 'lib-textarea-form-field',
  templateUrl: './textarea-form-field.component.html',
  styleUrls: ['./textarea-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFormFieldComponent),
      multi: true,
    },
  ],
})
export class TextareaFormFieldComponent extends FormControlBaseComponent {
  constructor() {
    super();
  }
}
