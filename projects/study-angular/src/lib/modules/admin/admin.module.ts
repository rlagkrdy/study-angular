import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { FormatterPipe } from '../pipe/pipes/formatter.pipe';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../admin/src/app/core/material/material.module';
import { AdminButtonImageUploadFormFieldComponent } from './components/button-image-upload-form-field/button-image-upload-form-field.component';
import { LibFormModule } from '../form/form.module';
import { AdminEditorFormFieldComponent } from './components/editor-form-field/editor-form-field.component';
import { LibTinymceModule } from '../tinymce/tinymce.module';
import { AdminButtonFileUploadFormFieldComponent } from './components/button-file-upload-form-field/button-file-upload-form-field.component';
import { LibPipeModule } from '../pipe/pipe.module';

@NgModule({
  declarations: [
    TableComponent,
    FormComponent,
    AdminButtonImageUploadFormFieldComponent,
    AdminEditorFormFieldComponent,
    AdminButtonFileUploadFormFieldComponent,
  ],
  exports: [TableComponent, FormatterPipe, FormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    LibFormModule,
    LibTinymceModule,
    LibPipeModule,
  ],
})
export class LibAdminModule {}
