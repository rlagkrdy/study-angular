import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';
@Component({
  selector: 'lib-select-box-form-field',
  templateUrl: './select-box-form-field.component.html',
  styleUrls: ['./select-box-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxFormFieldComponent),
      multi: true,
    },
  ],
})
export class SelectBoxFormFieldComponent extends FormControlBaseComponent {
  @Input() required = false;

  constructor() {
    super();
    this.formCtrl.setValue('');
  }
}
