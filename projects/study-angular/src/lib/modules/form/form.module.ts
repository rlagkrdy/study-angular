import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputFormFieldComponent } from "./components/input-form-field/input-form-field.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SlideToggleFormFiledComponent } from "./components/slide-toggle-form-filed/slide-toggle-form-filed.component";
import { SearchInputFormFieldComponent } from "./components/search-input-form-field/search-input-form-field.component";
import { LibSharedModule } from "../../shared/shared.module";
import { PhoneNumberStepValidFormFieldComponent } from "./components/phone-number-step-valid-form-field/phone-number-step-valid-form-field.component";
import { LibProfileModule } from "../profile/profile.module";
import { ProfileFormFieldComponent } from "./components/profile-form-field/profile-form-field.component";
import { SelectBoxFormFieldComponent } from "./components/select-box-form-field/select-box-form-field.component";
import { BirthFormFieldComponent } from "./components/birth-form-field/birth-form-field.component";
import { RadioFormFieldComponent } from "./components/radio-form-field/radio-form-field.component";
import { MatRadioModule } from "@angular/material/radio";
import { LibSnackbarModule } from "../snackbar/snackbar.module";
import { PostcodeFormFieldComponent } from "./components/postcode-form-field/postcode-form-field.component";
import { HolidayFormFieldComponent } from "./components/holiday-form-field/holiday-form-field.component";
import { ButtonImageUploadFormFieldComponent } from "./components/button-image-upload-form-field/button-image-upload-form-field.component";
import { TextareaFormFieldComponent } from "./components/textarea-form-field/textarea-form-field.component";
import { ThumbnailFormFieldComponent } from "./components/thumbnail-form-field/thumbnail-form-field.component";
import { DatePickerFormFieldComponent } from "./components/date-picker-form-field/date-picker-form-field.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CheckboxFormFieldComponent } from "./components/checkbox-form-field/checkbox-form-field.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    InputFormFieldComponent,
    SlideToggleFormFiledComponent,
    SearchInputFormFieldComponent,
    PhoneNumberStepValidFormFieldComponent,
    ProfileFormFieldComponent,
    SelectBoxFormFieldComponent,
    BirthFormFieldComponent,
    RadioFormFieldComponent,
    PostcodeFormFieldComponent,
    HolidayFormFieldComponent,
    ButtonImageUploadFormFieldComponent,
    TextareaFormFieldComponent,
    ThumbnailFormFieldComponent,
    DatePickerFormFieldComponent,
    CheckboxFormFieldComponent,
  ],
  exports: [
    InputFormFieldComponent,
    SlideToggleFormFiledComponent,
    SearchInputFormFieldComponent,
    PhoneNumberStepValidFormFieldComponent,
    ProfileFormFieldComponent,
    SelectBoxFormFieldComponent,
    BirthFormFieldComponent,
    RadioFormFieldComponent,
    PostcodeFormFieldComponent,
    HolidayFormFieldComponent,
    ButtonImageUploadFormFieldComponent,
    TextareaFormFieldComponent,
    ThumbnailFormFieldComponent,
    DatePickerFormFieldComponent,
    CheckboxFormFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    LibSharedModule,
    LibProfileModule,
    MatRadioModule,
    LibSnackbarModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
})
export class LibFormModule {}
