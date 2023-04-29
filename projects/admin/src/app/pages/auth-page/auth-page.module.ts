import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageRoutingModule } from './auth-page-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/material/material.module';
import {MatRippleModule} from "@angular/material/core";

@NgModule({
  declarations: [LoginPageComponent],
    imports: [
        CommonModule,
        AuthPageRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        MatRippleModule,
    ],
})
export class AuthPageModule {}
