import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { COMPOSITION_BUFFER_MODE } from "@angular/forms";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./core/core.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import localeKo from "@angular/common/locales/ko";

registerLocaleData(localeKo, "ko");
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "ko" },
    {
      provide: COMPOSITION_BUFFER_MODE,
      useValue: false,
    },
    { provide: ENVIRONMENT, useValue: environment },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
