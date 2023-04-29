import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[lib-content-child]',
})
export class ContentChildDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
