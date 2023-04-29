import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[mgStopPropagation]',
})
export class StopPropagationDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
