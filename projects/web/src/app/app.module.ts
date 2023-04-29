import { LOCALE_ID, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { registerLocaleData } from "@angular/common";
import localeKo from "@angular/common/locales/ko";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { ENVIRONMENT } from "../../../study-angular/src/lib/core/form";
import { COMPOSITION_BUFFER_MODE } from "@angular/forms";
import { HammerConfig } from "../../../study-angular/src/lib/modules/hammer/hammer-config";
import { LayoutPageComponent } from "./layout/components/layout-page/layout-page.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToolbarComponent } from "./layout/components/toolbar/toolbar.component";
import { FooterComponent } from "./layout/components/footer/footer.component";
import { LibSharedModule } from "../../../study-angular/src/lib/shared/shared.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";

registerLocaleData(localeKo, "ko");

@NgModule({
  declarations: [
    AppComponent,
    LayoutPageComponent,
    ToolbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    LibSharedModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    {
      provide: COMPOSITION_BUFFER_MODE,
      useValue: false,
    },
    { provide: ENVIRONMENT, useValue: environment },
    { provide: LOCALE_ID, useValue: "ko" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
