import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ComponentType } from '@angular/cdk/overlay';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet/bottom-sheet-ref';

@Injectable()
export class NgBottomSheetService {
  constructor(private bottomSheet: MatBottomSheet) {}

  open<T, E>(
    componentType: ComponentType<T>,
    data?: any
  ): MatBottomSheetRef<T, E> {
    return this.bottomSheet.open(componentType, {
      panelClass: 'lib-bottom-sheet-panel',
      backdropClass: 'lib-bottom-sheet-backdrop',
      disableClose: true,
      data,
    });
  }
}
