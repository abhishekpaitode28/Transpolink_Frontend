import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, '✕', {
      duration:           3000,
      horizontalPosition: 'right',
      verticalPosition:   'bottom',
      panelClass:         ['toast-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', {
      duration:           4000,
      horizontalPosition: 'right',
      verticalPosition:   'bottom',
      panelClass:         ['toast-error'],
    });
  }
}