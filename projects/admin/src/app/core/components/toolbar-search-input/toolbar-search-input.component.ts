import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControlBaseComponent } from '../../../../../../dn-accountant/src/lib/core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'adm-toolbar-search-input',
  templateUrl: './toolbar-search-input.component.html',
  styleUrls: ['./toolbar-search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToolbarSearchInputComponent),
      multi: true,
    },
  ],
})
export class ToolbarSearchInputComponent
  extends FormControlBaseComponent
  implements OnInit
{
  @Input() options = [
    { value: '1', text: '', type: '' },
    { value: '2', text: '', type: '' },
    { value: '3', text: '', type: '' },
    { value: '4', text: '', type: '' },
  ];

  filteredStreets: Observable<string[]>;

  override ngOnInit() {
    super.ngOnInit();

    this.filteredStreets = this.formCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = this._normalizeValue(value);
    return this.options.filter((option) =>
      this._normalizeValue(option.text).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
