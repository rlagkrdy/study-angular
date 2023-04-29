import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomComponentDialogComponent } from './components/custom-component-dialog/custom-component-dialog.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { NgDialogService } from './services/dialog.service';
import { DaumPostcodeDialogComponent } from './components/daum-postcode-dialog/daum-postcode-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { LibSharedModule } from '../../shared/shared.module';
import {ToolbarModule} from "../../../../../app/src/app/modules/toolbar/toolbar.module";
import { ThumbnailDialogComponent } from './components/thumbnail-dialog/thumbnail-dialog.component';
import { PolicyDialogComponent } from './components/policy-dialog/policy-dialog.component';
import {LibSliderModule} from "../slider/slider.module";

@NgModule({
  declarations: [
    MessageDialogComponent,
    CustomComponentDialogComponent,
    DaumPostcodeDialogComponent,
    ImageDialogComponent,
    ThumbnailDialogComponent,
    PolicyDialogComponent,
  ],
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        LibSharedModule,
        ToolbarModule,
        LibSliderModule,
    ],
  providers: [NgDialogService],
})
export class LibDialogModule {}
