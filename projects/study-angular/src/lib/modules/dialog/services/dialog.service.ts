import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { CustomComponentDialogComponent } from '../components/custom-component-dialog/custom-component-dialog.component';
import { MessageDialogComponent } from '../components/message-dialog/message-dialog.component';
import { DmDialogMessageOptions, DmDialogComponentOptions } from '../types';
import { DaumPostcodeDialogComponent } from '../components/daum-postcode-dialog/daum-postcode-dialog.component';
import { PostcodeData } from '../../postcode/services/postcode.service';
import { ImageDialogComponent } from '../components/image-dialog/image-dialog.component';

@Injectable()
export class NgDialogService {
  constructor(private dialog: MatDialog) {}

  open<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(component, config);
  }

  openMessage(
    options: DmDialogMessageOptions
  ): MatDialogRef<MessageDialogComponent> {
    return this.dialog.open(MessageDialogComponent, {
      panelClass: ['message-dialog', options.panelClass as string],
      data: options,
      autoFocus: false,
      disableClose: true,
    });
  }

  openComponent(
    options: DmDialogComponentOptions,
    panelClass?: string
  ): MatDialogRef<CustomComponentDialogComponent> {
    return this.dialog.open(CustomComponentDialogComponent, {
      panelClass: ['message-dialog', panelClass as string],
      data: options,
      autoFocus: false,
    }) as any;
  }

  openPostcode(): MatDialogRef<DaumPostcodeDialogComponent, PostcodeData> {
    return this.dialog.open(DaumPostcodeDialogComponent, {
      panelClass: ['postcode-dialog-panel'],
      autoFocus: false,
    });
  }

  openImage(src: string): MatDialogRef<ImageDialogComponent> {
    return this.dialog.open(ImageDialogComponent, {
      data: {
        src,
      },
      autoFocus: true,
    });
  }
}
