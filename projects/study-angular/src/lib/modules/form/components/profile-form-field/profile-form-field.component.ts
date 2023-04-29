import {Component, forwardRef} from '@angular/core';
import { NgUploadService } from '../../../../core/services/upload.service';
import { finalize } from 'rxjs';
import { FormControlBaseComponent } from '../../../../core/form';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'lib-profile-form-field',
  templateUrl: './profile-form-field.component.html',
  styleUrls: ['./profile-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileFormFieldComponent),
      multi: true,
    },
  ],
})
export class ProfileFormFieldComponent extends FormControlBaseComponent {
  isUploading = false;
  percentage = 0;

  constructor(private uploadService: NgUploadService) {
    super();
  }

  get url(): string {
    return this.formCtrl.value;
  }

  upload(target: EventTarget): void {
    const file = (target as HTMLInputElement).files[0];
    if (file) {
      this.isUploading = true;

      const uploadTask = this.uploadService.upload(file, 'test');

      uploadTask.percentageChange().subscribe((percentage) => {
        this.percentage = percentage * 100;
      });

      uploadTask
        .getDownloadURL()
        .pipe(
          finalize(() => {
            this.isUploading = false;
          })
        )
        .subscribe((url) => {
          this.formCtrl.setValue(url);
        });
    }
  }
}
