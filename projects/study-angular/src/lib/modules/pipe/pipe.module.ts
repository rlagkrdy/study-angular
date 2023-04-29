import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatterPipe } from './pipes/formatter.pipe';
import { SplitPropertyPipe } from './pipes/split-property.pipe';

@NgModule({
  declarations: [FormatterPipe, SplitPropertyPipe],
  exports: [FormatterPipe, SplitPropertyPipe],
  imports: [CommonModule],
})
export class LibPipeModule {}
m