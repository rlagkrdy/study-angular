import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[libNavigateRoot]',
})
export class NavigateRootDirective {
  constructor(private router: Router) {}

  @HostListener('click')
  onClick(): void {
    this.router.navigateByUrl('/').then();
  }
}
