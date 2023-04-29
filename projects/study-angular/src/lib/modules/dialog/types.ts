import { ComponentType } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';


export const DM_DIALOG_DATA = new InjectionToken<any>('sd-dialogs-data');


export interface DmDialogComponentOptions extends DmDialogCommonOptions {
  component: ComponentType<any>;
  data?: any;
}

export interface DmDialogMessageOptions extends DmDialogCommonOptions {
  title?: string;
  message: string;
  closeDisabled?: boolean;
  isPrompt?: boolean;
  promptType?: string;
  promptPlaceHolder?: string;
}

export interface DmDialogCommonOptions {
  confirmButtonText?: string;
  cancelButtonText?: string;
  panelClass?: string;
}


