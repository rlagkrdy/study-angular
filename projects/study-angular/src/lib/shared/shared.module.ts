import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { BlurOnClickDirective } from './directives/blur-on-click.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { SrcDirective } from './directives/src.directive';
import { CoverDirective } from './directives/cover.directive';
import { BackDirective } from './directives/back.directive';
import { NavigateRootDirective } from './directives/navigate-root.directive';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    BlurOnClickDirective,
    StopPropagationDirective,
    EllipsisPipe,
    SrcDirective,
    CoverDirective,
    BackDirective,
    NavigateRootDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    SafeHtmlPipe,
    BlurOnClickDirective,
    StopPropagationDirective,
    EllipsisPipe,
    SrcDirective,
    CoverDirective,
    BackDirective,
    NavigateRootDirective,
  ],
})
export class LibSharedModule {}
