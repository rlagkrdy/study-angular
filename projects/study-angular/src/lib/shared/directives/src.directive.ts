import { Directive, Renderer2, ElementRef, Input } from '@angular/core';

export function imageMagnificationReplacer(fileName: string, magnification: number) {
  return fileName.replace(/.([^.]*)$/, `@${magnification}x.$1`);
}

@Directive({
  selector: '[libSrc]'
})
export class SrcDirective {
  @Input()
  set libSrc(src: string) {
    const nativeElement = this.elementRef.nativeElement;
    this.renderer.setAttribute(nativeElement, 'src', src);
    this.renderer.setAttribute(
      nativeElement,
      'srcset',
      `${src} 1x, ${imageMagnificationReplacer(src, 2)} 2x`
    );
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
}

