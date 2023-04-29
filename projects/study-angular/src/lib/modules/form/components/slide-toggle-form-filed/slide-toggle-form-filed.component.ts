import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {FormControlBaseComponent} from "../../../../core/form";

@Component({
  selector: 'lib-slide-toggle-form-filed',
  templateUrl: './slide-toggle-form-filed.component.html',
  styleUrls: ['./slide-toggle-form-filed.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SlideToggleFormFiledComponent),
      multi: true,
    },
  ],
})
export class SlideToggleFormFiledComponent extends FormControlBaseComponent {
  @Input() required = false;
  @Input() onText = '';
  @Input() offText = this.onText;

  constructor() {
    super();
  }
}
