import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { FormGroupBaseComponent } from '../../../../core/form';
import {
  PostcodeData,
  PostcodeService,
} from '../../../postcode/services/postcode.service';
import { NgDialogService } from '../../../dialog/services/dialog.service';
import { makeAddressInfoFromDaumPostcode } from '../../../postcode/utils';
import { NgMapService } from '../../../map/service/map.service';

export interface PostcodeForm {
  postcode: string;
  address: string;
  addressDetail: string;
  sigunguCode: string;
  dongCode: string;
  bun: string;
  ji: string;
  lat: string;
  lng: string;
}

@Component({
  selector: 'nik-postcode-form-field',
  templateUrl: './postcode-form-field.component.html',
  styleUrls: ['./postcode-form-field.component.scss'],
})
export class PostcodeFormFieldComponent extends FormGroupBaseComponent {
  @Input() label: string;
  @Input() readonly = false;
  @Input() inline: boolean;
  @Input() border: boolean;
  @Input() required: boolean;
  @Input() isDisabled: boolean;

  override formGroup = this.createForm();

  constructor(
    private fb: FormBuilder,
    private postcodeService: PostcodeService,
    private dialogService: NgDialogService,
    private mapService: NgMapService
  ) {
    super();
  }

  openPostcode(): void {
    this.dialogService
      .openPostcode()
      .afterClosed()
      .pipe(filter((data) => Boolean(data)))
      .subscribe((result: PostcodeData) => {
        this.mapService.getAddressLatLng(result.address).then((latLng) => {
          this.formGroup.patchValue(
            Object.assign(makeAddressInfoFromDaumPostcode(result), latLng)
          );
        });
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      postcode: [null],
      address: [null],
      addressDetail: [null],
      sigunguCode: [null],
      dongCode: [null],
      bun: [null],
      ji: [null],
      lat: [null],
      lng: [null],
    });
  }
}
