import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';
import { NgUploadService } from '../../../../core/services/upload.service';

@Component({
  selector: 'lib-admin-button-image-upload-form-field',
  templateUrl: './button-image-upload-form-field.component.html',
  styleUrls: ['./button-image-upload-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminButtonImageUploadFormFieldComponent),
      multi: true,
    },
  ],
})
export class AdminButtonImageUploadFormFieldComponent extends FormControlBaseComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
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
          .subscribe((imageUrl: string) => {
            this.fileInput.nativeElement.value = null;
            this.formCtrl.setValue(imageUrl);
          });
    }
  }

  remove(filePath: string): void {
    this.formCtrl.reset(null);
    this.uploadService.removeFile(filePath);
  }

  private checkIsMedia(file: File): boolean {
    const imageReg: RegExp = new RegExp(/video|image/);
    return imageReg.test(file.type);
  }
}
