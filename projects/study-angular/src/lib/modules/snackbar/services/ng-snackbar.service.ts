import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from "@angular/material/snack-bar";

@Injectable()
export class NgSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openMessage(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, "", {
      panelClass: ["lib-snackbar"],
      duration: 1000,
    });
  }
}
