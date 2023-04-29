import { Component, OnInit, Inject, Injector, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DmDialogComponentOptions } from '../../types';


@Injectable()
export class CustomComponentDialogData {
  data: any;
}

@Component({
  selector: 'nik-message-dialog',
  templateUrl: './custom-component-dialog.component.html',
  styleUrls: ['./custom-component-dialog.component.scss']
})
export class CustomComponentDialogComponent implements OnInit {
  component = this.data.component;
  confirmButtonText = this.data.confirmButtonText;
  cancelButtonText = this.data.cancelButtonText;

  dataInject;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DmDialogComponentOptions,
    private injector: Injector
  ) {
    this.dataInject = Injector.create({
      providers: [
        {
          provide: CustomComponentDialogData, useValue: { data: this.data.data }
        }
      ], parent: this.injector
    });
  }

  ngOnInit(): void {
  }

}
