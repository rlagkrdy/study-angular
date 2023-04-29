import { Component, forwardRef, Input } from '@angular/core';
import { FormControlBaseComponent } from '../../../../core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-radio-form-field',
  templateUrl: './radio-form-field.component.html',
  styleUrls: ['./radio-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioFormFieldComponent),
      multi: true,
    },
  ],
})
export class RadioFormFieldComponent extends FormControlBaseComponent {
  @Input() options: { text: string; value: string }[];
  constructor() {
    super();
  }
}
