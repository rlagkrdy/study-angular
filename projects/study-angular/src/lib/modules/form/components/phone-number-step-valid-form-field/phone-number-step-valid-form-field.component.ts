import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { FormControlBaseComponent } from '../../../../core/form';
import { interval, Subscription } from 'rxjs';
import { delayMicrotask } from '../../../../../../../../src/core/utils';
import { NgApiService } from '../../../../core/services/api.service';
import { NgSnackbarService } from '../../../snackbar/services/ng-snackbar.service';

@Component({
  selector: 'lib-phone-number-step-valid-form-field',
  templateUrl: './phone-number-step-valid-form-field.component.html',
  styleUrls: ['./phone-number-step-valid-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberStepValidFormFieldComponent),
      multi: true,
    },
  ],
})
export class PhoneNumberStepValidFormFieldComponent extends FormControlBaseComponent {
  formGroup = this.createFormGroup();

  step: number = 0;
  certificationCount: string;
  certificationIntervalSubscription: Subscription;
  timer: number = 0;

  @Output() onVerificationPass = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private apiService: NgApiService,
    private snackbarService: NgSnackbarService
  ) {
    super();
    this.formCtrl.setValidators(Validators.required);
    this.formCtrl.updateValueAndValidity();
  }

  requestCertification(): void {
    this.step = 1;
    this.startTimer();

    const { phoneNumber } = this.formGroup.value;

    this.apiService
      .sendVerificationCode(phoneNumber).subscribe(val=>{
          this.checkStatus(val)
    })
  }

  checkStatus(response){
    let msg = "";
    console.log()
    if(response.data['status'] !== "0"){
      switch (response.data.status) {
        case '102':
          msg ='받은사람의 번호형식을 확인하여 수정 후 발송 해주세요.';
          break;
        case '104':
          msg = "받는 사람의 정보가 없습니다.";
          break;
        default :
          msg = "알수없는 오류입니다. 관리자에게 문의해주세요";
          break;
      }

      this.snackbarService.openMessage(msg);
    }
  }
  checkVerificationCode(): void {
    if (this.timer <= 0) {
      alert('인증시간 초과');
      setTimeout(() => this.onVerificationPass.emit(false));
      return;
    }
    const { phoneNumber, certification } = this.formGroup.value;

    this.apiService.checkVerificationCode(phoneNumber, certification).subscribe(
      (result) => {
        this.onVerificationPass.emit(true);
        this.unsubscribeTimer();
      },
      (error) => {
        this.snackbarService.openMessage('인증번호가 정확하지 않습니다.');
        this.onVerificationPass.emit(false);
      }
    );
  }

  private startTimer(): void {
    this.unsubscribeTimer();
    this.certificationIntervalSubscription = this.setInterval();
  }

  private setInterval(): Subscription {
    this.timer = 180;
    let minutes;
    let seconds;

    return interval(1000).subscribe(() => {
      minutes = Math.floor(this.timer / 60);
      seconds = Math.floor(this.timer % 60);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.certificationCount = minutes + ':' + seconds;
      --this.timer;
      if (this.timer < 0) {
        this.unsubscribeTimer();
      }
    });
  }

  private unsubscribeTimer(): void {
    console.log(
      'certificationIntervalSubscription',
      this.certificationIntervalSubscription
    );
    if (this.certificationIntervalSubscription) {
      this.certificationIntervalSubscription.unsubscribe();
      console.log('enter unsubscribe');
    }
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      phoneNumber: ['', Validators.required],
      certification: ['', Validators.required],
    });
  }

  protected override initValueChange(): Subscription {
    return this.formGroup.valueChanges.subscribe((value) => {
      delayMicrotask(() => {
        if (this.checkValidValue(value)) {
          this.emit(this.convertToEmitValue(value));
        }
      });
    });
  }

  protected override convertToEmitValue(value: any): string {
    return value.phoneNumber;
  }

  protected override initStatusChange(): Subscription {
    return this.formGroup.statusChanges.subscribe((status) => {
      delayMicrotask(() => {
        this.invalidChange.emit(status !== 'VALID');
      });
    });
  }
}
