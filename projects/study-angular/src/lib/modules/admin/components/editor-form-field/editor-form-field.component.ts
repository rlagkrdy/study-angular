import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';

@Component({
  selector: 'lib-admin-editor-form-field',
  templateUrl: './editor-form-field.component.html',
  styleUrls: ['./editor-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminEditorFormFieldComponent),
      multi: true,
    },
  ],
})
export class AdminEditorFormFieldComponent extends FormControlBaseComponent {
  @Input() override label: string;
  @Input() dirPath: string;

  constructor() {
    super();
  }
}
