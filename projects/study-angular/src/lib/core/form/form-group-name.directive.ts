import {
  Directive,
  Input,
  Optional,
  Self,
  Inject,
  SkipSelf,
  Host,
  OnInit,
} from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { SubscriptionBaseComponent } from "../base-components/subscription/subscription-base.component";
import { B4sFormGroup } from "./form-group";
import { B4S_GROUP_VALUE_ACCESSOR } from "./tokens";
import { B4sGroupValueAccessor, FormGroupNameConverter } from "./types";

@Directive({
  selector: "[b4sFormGroupName]",
})
export class FormGroupNameDirective
  extends SubscriptionBaseComponent
  implements OnInit
{
  @Input("b4sFormGroupName") name: string;
  @Input() nameConverter: FormGroupNameConverter;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    @Optional()
    @Self()
    @Inject(B4S_GROUP_VALUE_ACCESSOR)
    private groupValueAccessor: B4sGroupValueAccessor
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormValue();
  }

  private setFormValue() {
    const formGroup = this.name
      ? (this.parent.control?.get(this.name) as FormGroup)
      : (this.parent.control as FormGroup);

    if (!(formGroup instanceof FormGroup)) {
      throw new Error("선택 된 Control은 FormGroup이 아닙니다");
    }

    this.groupValueAccessor.formGroup = new B4sFormGroup(
      formGroup,
      this.groupValueAccessor.controlTypeMap,
      this.nameConverter
    );
  }
}
