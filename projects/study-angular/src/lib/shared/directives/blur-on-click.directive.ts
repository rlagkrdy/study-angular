import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mgBlurOnClick]'
})
export class BlurOnClickDirective {

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('click')
  onClick() {
    this.elementRef.nativeElement.blur();
  }
}
