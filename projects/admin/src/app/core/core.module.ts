import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { LayoutPageComponent } from './components/layout-page/layout-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from './material/material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { LibDialogModule } from '../../../../dn-accountant/src/lib/modules/dialog/dialog.module';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { ToolbarSearchInputComponent } from './components/toolbar-search-input/toolbar-search-input.component';

@NgModule({
  declarations: [LayoutPageComponent, SidebarComponent, ToolbarSearchInputComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        LibDialogModule,
        MaterialModule,
        MatAutocompleteModule
    ],
  exports: [LayoutPageComponent, SidebarComponent, MatNativeDateModule],
})
export class CoreModule {}
