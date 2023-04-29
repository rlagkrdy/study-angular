import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TinymceComponent } from './components/tinymce/tinymce.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [TinymceComponent],
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule
  ],
  exports: [TinymceComponent]
})
export class LibTinymceModule { }
