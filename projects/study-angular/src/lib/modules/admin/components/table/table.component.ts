import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<E> {
  @ViewChild(MatTable) table!: MatTable<E>;
  dataSource: MatTableDataSource<E>;
  displayedColumns = [];
  selection = new SelectionModel<E>(true, []);

  @Input() totalCount: number;
  @Input() pageSize: number;
  @Input() page: number;
  @Input()
  get adminTableHeaders() {
    return this._adminTableHeaders;
  }
  set adminTableHeaders(adminTableHeaders: AdminTableHeader[]) {
    this.displayedColumns = adminTableHeaders.map((item) => item.key);
    this._adminTableHeaders = adminTableHeaders.filter(
      (item) =>
        item.key !== 'checkbox' && item.key !== 'index' && item.key !== 'no'
    );
  }

  @Input()
  set data(data) {
    this.dataSource = new MatTableDataSource<E>(data);
    setTimeout(() => (this.table.dataSource = this.dataSource));
  }

  @Output() rowClicked = new EventEmitter<E>();
  @Output() selectionChanged = new EventEmitter<SelectionModel<E>>();

  private _adminTableHeaders: AdminTableHeader[];

  constructor() {
    this.selection.changed.subscribe(() =>
      this.selectionChanged.emit(this.selection)
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: E): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  closeFormatteWithDate(date: Date) {
    const today = new Date();
    if (!date) {
      return '공통';
    } else {
      if (today > date) {
        return '종료';
      } else {
        return '진행';
      }
    }
  }
}

export interface AdminTableHeader {
  title: string;
  key: string;
  formatter?: any;
}
