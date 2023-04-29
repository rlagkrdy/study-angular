import { Component, forwardRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FormControlBaseComponent } from '../../../../core/form';
import { NgUploadService } from '../../../../core/services/upload.service';

@Component({
  selector: 'lib-tinymce',
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceComponent),
      multi: true,
    },
  ],
})
export class TinymceComponent extends FormControlBaseComponent implements AfterViewInit {
  @ViewChild('tinymce') tinymce: EditorComponent;

  @Input() dirPath: string;

  @Input()
  set height(height: number) {
    if (height) {
      this.config.height = height;
    }
  }

  // tslint:disable:max-line-length
  config = {
    content_css: '/assets/tinymce/tinymce.css',
    base_url: '/tinymce',
    suffix: '.min',
    font_size_formats: "10px 12px 14px 16px 18px 20px 24px 36px 48px",
    // print fullpage paste noneditable textpattern toc hr imagetools
    plugins:
      'preview  importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: '',
    // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    // media link | fontsizeselect | print |
    toolbar:
      'fontsize bold underline | alignleft aligncenter alignright | forecolor |  insertfile image',
    images_upload_handler: this.imagesUploadHandler.bind(this),
    height: 600,
    language_url: '/assets/tinymce/langs/ko_KR.js',
    language: 'ko_KR',
  };
  // tslint:enable:max-line-length

  constructor(private uploader: NgUploadService) {
    super(null);
  }

  ngAfterViewInit(): void {}

  imagesUploadHandler(blobInfo): Promise<string | undefined> {
    const uploadTask = this.uploader.upload(blobInfo.blob(), this.dirPath, blobInfo.filename());

    return uploadTask.getDownloadURL().toPromise();
  }

  protected override convertToEmitValue(value: string): string {
    console.log('value', value);
    if (
      value ===
      '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '</head>\n' +
        '<body>\n' +
        '\n' +
        '</body>\n' +
        '</html>'
    ) {
      return null;
    }

    console.log('value22', value);
    return value;
  }
}
