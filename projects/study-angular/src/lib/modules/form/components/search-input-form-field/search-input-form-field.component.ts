import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControlBaseComponent } from '../../../../core/form';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, switchMap, tap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgKeywordService } from '../../../../db/keyword/service/keyword.service';

@Component({
  selector: 'lib-search-input-form-field',
  templateUrl: './search-input-form-field.component.html',
  styleUrls: ['./search-input-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputFormFieldComponent),
      multi: true,
    },
  ],
})
export class SearchInputFormFieldComponent
  extends FormControlBaseComponent
  implements OnInit
{
  @Input() type = 'text';
  @Input() useAddKeyword: boolean;
  @Input() isShowKeywordList: boolean = true;

  @Output() addTag = new EventEmitter<string>();
  @Output() addKeyword = new EventEmitter<string>();

  keywordResult: any[] = [];
  isLoading = false;

  constructor(private keywordService: NgKeywordService) {
    super();
  }

  get keywordValue() {
    return this.formCtrl.value;
  }

  get hasValue() {
    return Boolean(this.formCtrl.value);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setSubscription(
      '_initKeywordValueChange',
      this.initKeywordValueChange()
    );
  }

  reset(): void {
    this.formCtrl.patchValue('');
  }

  private initKeywordValueChange(): Subscription {
    return this.formCtrl.valueChanges
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(1000),
        switchMap((keyword) =>
          this.keywordService.listAutocompleteKeywords(keyword, 0)
        )
      )
      .subscribe((result) => {
        this.keywordResult = result;
        this.isLoading = false;
      });
  }
}
