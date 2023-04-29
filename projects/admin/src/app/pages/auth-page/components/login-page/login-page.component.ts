import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notifier } from '../../../../core/services/notifier.service';
import { Observable } from 'rxjs';
import { NgAuthService } from '../../../../../../../dn-accountant/src/lib/db/auth/auth.service';

@Component({
  selector: 'bm-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  loginForm = this.createForm();
  isAdmin$: Observable<boolean> = this.authService.isAdmin$;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: NgAuthService,
    private notifier: Notifier
  ) {}

  login(): void {
    return;
    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;

    this.isLoading = true;

    this.authService
      .login(formValue.email, formValue.password)
      .subscribe(() => {
        this.notifier.success('로그인 하였습니다.');
        this.router.navigate(['/news/list']).then();
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin$.subscribe((val) => {
      if (val) {
        this.router.navigate(['/news/list']).then();
      }
    });
  }
}
