import { EventEmitter, Output, Input, Directive } from '@angular/core';


@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class PaginatorBlockBaseComponent {
  @Input()
  get totalCount(): number { return this._totalCount; }
  set totalCount(totalCount: number) {
    if (totalCount) {
      this._totalCount = totalCount;
      this.totalPage = Math.ceil(this.totalCount / this.perPage);

      if (this.currentPage > this.totalPage) {
        this.changePage(this.totalPage);
      } else {
        this.makeBlock();
      }
    } else {
      this.currentBlockIndex = 0;
      this.currentBlock = [1];
    }
  }
  private _totalCount: number;

  @Input() currentPage = 1;
  @Input()
  protected _perPage = 10;
  public get perPage() {
        return this._perPage;
    }
    public set perPage(value) {
        this._perPage = value;
    }

  @Input()
  protected _perBlock = 10;
  public get perBlock() {
        return this._perBlock;
    }
    public set perBlock(value) {
        this._perBlock = value;
    }

  @Output() pageChange = new EventEmitter<{ previousPageIndex: number, pageIndex: number }>();

  totalPage: number;
  currentBlock: number[] = [];
  currentBlockIndex = 0;

  changePage(page: number) {
    this.pageChange.emit({ previousPageIndex: this.currentPage, pageIndex: page });
    this.currentPage = page;
    this.makeBlock();
  }

  protected makeBlock() {
    this.currentBlockIndex = Math.ceil(this.currentPage / this.perBlock) - 1;

    const blockLength = this.totalPage - (this.currentBlockIndex * this.perBlock) < this.perBlock
      ? this.totalPage - (this.currentBlockIndex * this.perBlock)
      : this.perBlock;

    this.currentBlock = new Array(blockLength)
      .fill(0)
      .map((value, index) => (this.currentBlockIndex * this.perBlock) + index + 1);
  }
}
