import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DmDialogMessageOptions } from '../../types';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'nik-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageDialogComponent implements OnInit {
  title = this.data.title;
  message = this.data.message;
  closeDisabled = this.data.closeDisabled;

  confirmButtonText = this.data.confirmButtonText;
  cancelButtonText = this.data.cancelButtonText;
  isPrompt = this.data.isPrompt;
  promptType = this.data.promptType || 'text';
  promptPlaceHolder = this.data.promptPlaceHolder || '';

  promptCtrl = new FormControl(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DmDialogMessageOptions,
    public dialogRef: MatDialogRef<MessageDialogComponent>
  ) {}

  ngOnInit(): void {}

  close(isConfirm: boolean) {
    if (isConfirm) {
      this.dialogRef.close(this.promptCtrl.value);
    } else {
      this.dialogRef.close(false);
    }
  }
}
