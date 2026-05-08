import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar }              from '@angular/material/snack-bar';

import { UserSevice } from '../../services/user.service';
import { CreateUserRequest, User } from '../../../../core/models/user.model';
import { USER_ROLE_OPTIONS } from '../../../../shared/constants/role.constants';

@Component({
  selector: 'tl-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrls:   ['./create-user-dialog.component.scss'],
})
export class CreateUserDialogComponent {
  private fb        = inject(FormBuilder);
  private usersApi  = inject(UserSevice);
  private snackbar  = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent, User | null>);


  saving       = signal(false);
  errorMsg     = signal('');
  showPassword = signal(false);

  roleOptions = USER_ROLE_OPTIONS;


  form: FormGroup = this.fb.group({
    fullName:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:       ['', [Validators.required, Validators.email]],
    password:    ['', [Validators.required, Validators.minLength(8)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
    role:        ['Citizen', [Validators.required]],
  });


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');

    this.usersApi.create(this.form.value as CreateUserRequest).subscribe({
      next: createdUser => {
        this.saving.set(false);
        this.snackbar.open(
          `User "${createdUser.fullName}" created successfully.`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(createdUser);
      },
      error: err => {
        this.saving.set(false);
        this.errorMsg.set(this.extractError(err, 'Failed to create user.'));
      },
    });
  }


  onCancel(): void {
    this.dialogRef.close(null);
  }


  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  private extractError(err: any, fallback: string): string {
    return err?.error?.message
        || err?.error?.title
        || err?.message
        || fallback;
  }
}