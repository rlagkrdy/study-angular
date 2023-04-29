import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { HorizonLineNavListComponent } from './components/horizon-line-nav-list/horizon-line-nav-list.component';

@NgModule({
  declarations: [
    NavListComponent,
    NavItemComponent,
    HorizonLineNavListComponent,
  ],
  exports: [NavListComponent, NavItemComponent, HorizonLineNavListComponent],
  imports: [CommonModule],
})
export class LibNavModule {}
