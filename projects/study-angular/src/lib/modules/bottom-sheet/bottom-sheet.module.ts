import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgBottomSheetService } from './services/bottom-sheet.service';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatBottomSheetModule],
  providers: [NgBottomSheetService],
})
export class LibBottomSheetModule {}
