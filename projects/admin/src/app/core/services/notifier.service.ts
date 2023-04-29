import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { NotifierAdapter } from '../../../../../../src/core/notifier/notifier-adapter';
import { HotObservableOnce } from '../../../../../../src/core/types';

@Injectable({
  providedIn: 'root',
})
export class Notifier implements NotifierAdapter {
  constructor(private snackBar: MatSnackBar) {}

  info(message: string, duration = 2000): HotObservableOnce<void> {
    this.snackBar.open(message, '', { duration, panelClass: 'info' });
    return of(null);
  }

  success(message: string, duration = 2000): HotObservableOnce<void> {
    this.snackBar.open(message, '', { duration, panelClass: 'success' });
    return of(null);
  }

  warning(message: string, duration = 2000): HotObservableOnce<void> {
    this.snackBar.open(message, '', { duration, panelClass: 'warning' });
    return of(null);
  }

  error(
    message: string,
    error?: Error,
    duration = 5000
  ): HotObservableOnce<void> {
    this.snackBar.open(message, '', { duration, panelClass: 'error' });

    if (error) {
      console.error(error);
    }

    return of(null);
  }
}
