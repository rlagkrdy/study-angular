import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';
import { NgUploadService } from '../../../../core/services/upload.service';

@Component({
  selector: 'lib-admin-file-upload-form-field',
  templateUrl: './button-file-upload-form-field.component.html',
  styleUrls: ['./button-file-upload-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminButtonFileUploadFormFieldComponent),
      multi: true,
    },
  ],
})
export class AdminButtonFileUploadFormFieldComponent extends FormControlBaseComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @Input() dirPath: string;
  @Input() accept: string;
  isUploading = false;
  percentage = 0;

  fileName = '';

  constructor(private uploadService: NgUploadService, private fb: FormBuilder) {
    super();
  }

  get url(): string {
    return this.formCtrl.value;
  }

  upload(target: EventTarget): void {
    const file = (target as HTMLInputElement).files[0];
    if (file) {
      this.isUploading = true;

      const path = this.dirPath + '/' + this.uploadService.generateDatePath(file.name);

      const uploadTask = this.uploadService.upload(file, path, file.name);

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
          this.fileInput.nativeElement.value = null;
          this.fileName = file.name;
          this.formCtrl.setValue(imageUrl);
        });
    }
  }

  remove(filePath: string): void {
    this.formCtrl.reset(null);
    this.uploadService.removeFile(filePath);
  }

  protected override convertToControlValue(value: string): string {
    if (value) {
      this.fileName = this.uploadService.getFileName(value);
    }
    return value;
  }
}
