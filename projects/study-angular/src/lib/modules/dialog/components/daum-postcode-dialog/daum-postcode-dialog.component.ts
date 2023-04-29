import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PostcodeService } from '../../../postcode/services/postcode.service';

@Component({
  selector: 'nik-daum-postcode-dialog',
  templateUrl: './daum-postcode-dialog.component.html',
  styleUrls: ['./daum-postcode-dialog.component.scss'],
})
export class DaumPostcodeDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DaumPostcodeDialogComponent>,
    private postcodeService: PostcodeService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initPostcode().then();
  }

  private async initPostcode(): Promise<void> {
    const postElement: HTMLElement =
      this.elementRef.nativeElement.querySelector(
        '.daum-postcode-box'
      ) as HTMLElement;

    const data = await this.postcodeService.embed(postElement);

    this.dialogRef.close(data);
  }
}
