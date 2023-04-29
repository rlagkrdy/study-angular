import { Component, Input, OnInit } from '@angular/core';
import { FormGroupBaseComponent } from '../../../../core/form';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lib-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends FormGroupBaseComponent implements OnInit {
  @Input() adminFormControls: AdminFormControl[];
  @Input() override formGroup: FormGroup;

  controlType = AdminFromControlType;

  constructor() {
    super();
  }

  get file(): string {
    return this.formGroup.value.file.url;
  }

  ngOnInit(): void {}
}

export interface AdminFormControl {
  label: string;
  formControlName: string;
  placeholder: string;
  type: AdminFromControlType;
  dirPath?: string;
  options?: { value: any; text: string }[];
}

export enum AdminFromControlType {
  INPUT = 1,
  NUMBER = 2,
  DATE = 5,
  FILE = 10,
  IMAGE = 11,
  VIDEO = 12,
  CHECKBOX = 15,
  SELECTBOX = 20,
  RADIOBOX = 25,
  EDITOR = 30,
}
