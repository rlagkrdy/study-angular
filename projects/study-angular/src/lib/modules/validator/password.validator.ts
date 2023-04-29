import {FormControl, FormGroup} from '@angular/forms';

export class PasswordValidator {
  static MatchPassword(fg: FormGroup): any {
    const passwordControl = fg.get('password');
    const passwordCheckControl = fg.get('passwordCheck');

    const valid = [passwordControl.valid, passwordCheckControl.valid].every(
      (value) => Boolean(value)
    );

    const password = passwordControl.value;
    const confirmPassword = passwordCheckControl.value;

    console.log(valid && password !== confirmPassword);

    if (valid && password !== confirmPassword) {
      return { match: true };
    } else {
      return null;
    }
  }

  static checkCurrentPassword(fg: FormGroup) {
    const currentPasswordControl = fg.get('currentPassword');
    const passwordControl = fg.get('password');
    const passwordCheckControl = fg.get('passwordCheck');

    const valid = [
      currentPasswordControl.valid,
      passwordControl.valid,
      passwordCheckControl.valid,
    ].every((value) => Boolean(value));

    const currentPassword = currentPasswordControl.value;
    const password = passwordControl.value;

    if (valid && password === currentPassword) {
      return { samePassword: true };
    } else {
      return null;
    }
  }

  static pattern(fc: FormControl) {
    const password = fc.value;
    if (!/^[A-Za-z0-9!@#$%^&*+=]{6,20}$/.test(password)) {
      return { pattern: true };
    } else {
      return null;
    }
  }
}
