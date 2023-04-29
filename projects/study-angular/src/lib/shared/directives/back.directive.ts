import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[libBack]'
})
export class BackDirective {

  constructor(
    private location: Location
  ) { }

  @HostListener('click')
  onClick() {
    this.location.back();
  }
}
