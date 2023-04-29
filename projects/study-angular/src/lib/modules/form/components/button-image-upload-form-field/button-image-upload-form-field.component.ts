import { Component, forwardRef, Input } from '@angular/core';
import { NgUploadService } from '../../../../core/services/upload.service';
import { finalize } from 'rxjs';
import { FormControlBaseComponent } from '../../../../core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-button-image-upload-form-field',
  templateUrl: './button-image-upload-form-field.component.html',
  styleUrls: ['./button-image-upload-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonImageUploadFormFieldComponent),
      multi: true,
    },
  ],
})
export class ButtonImageUploadFormFieldComponent extends FormControlBaseComponent {
  @Input() dirPath: string;
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
      if (!this.checkIsMedia(file)) {
        alert('사진 혹은 영상만 업로드 가능합니다.');
        return;
      }

      this.isUploading = true;

      const uploadTask = this.uploadService.upload(file, this.dirPath);

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
        .subscribe((imageUrl) => {
          this.formCtrl.setValue({ imageUrl, type: file.type });
        });
    }
  }

  private checkIsMedia(file: File): boolean {
    const imageReg: RegExp = new RegExp(/video|image/);
    return imageReg.test(file.type);
  }
}
