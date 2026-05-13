import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators,
} from "@angular/forms";

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";

import { UserSevice } from "../../services/user.service";
import { CreateUserRequest, User } from "../../../../core/models/user.model";
import { USER_ROLE_OPTIONS } from "../../../../shared/constants/role.constants";

function strongPassword(ctrl: AbstractControl): ValidationErrors | null {
  const v = ctrl.value ?? '';
  if (!v) return null;
  const ok = /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v);
  return ok ? null : { weakPassword: true };
}

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const cp = group.get('confirmPassword')?.value;
  if (!pw || !cp) return null;
  return pw === cp ? null : { passwordMismatch: true };
}

@Component({
  selector: "tl-create-user-dialog",
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./create-user-dialog.component.html",
  styleUrls: ["./create-user-dialog.component.scss"],
})
export class CreateUserDialogComponent {
  private fb = inject(FormBuilder);
  private usersApi = inject(UserSevice);
  private snackbar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent, User | null>);

  saving              = signal(false);
  errorMsg            = signal("");
  showPassword        = signal(false);
  showConfirmPassword = signal(false);
  submitAttempted     = signal(false);

  roleOptions = USER_ROLE_OPTIONS;

  form: FormGroup = this.fb.group(
    {
      fullName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email:    ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), strongPassword]],
      confirmPassword: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      role: ["Citizen", [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  passwordMatchStatus(): 'match' | 'mismatch' | 'pending' {
    const pw = this.form.get('password')?.value;
    const cp = this.form.get('confirmPassword')?.value;
    if (!pw || !cp) return 'pending';
    return pw === cp ? 'match' : 'mismatch';
  }

  getErrors(): string[] {
    if (!this.submitAttempted()) return [];
    const errs: string[] = [];
    const f = this.form;
    if (f.get('fullName')?.hasError('required'))  errs.push('Full name is required.');
    if (f.get('fullName')?.hasError('minlength')) errs.push('Full name must be at least 2 characters.');
    if (f.get('fullName')?.hasError('maxlength')) errs.push('Full name must be at most 100 characters.');
    if (f.get('email')?.hasError('required'))     errs.push('Email is required.');
    if (f.get('email')?.hasError('email'))        errs.push('Enter a valid email address.');
    if (f.get('password')?.hasError('required'))    errs.push('Password is required.');
    if (f.get('password')?.hasError('minlength'))   errs.push('Password must be at least 8 characters.');
    if (f.get('password')?.hasError('weakPassword')) errs.push('Password must include uppercase, lowercase, and a digit.');
    if (f.get('confirmPassword')?.hasError('required')) errs.push('Please confirm the password.');
    if (f.hasError('passwordMismatch'))             errs.push('Password and confirm password do not match.');
    if (f.get('phoneNumber')?.hasError('required')) errs.push('Phone is required.');
    if (f.get('phoneNumber')?.hasError('pattern'))  errs.push('Phone must be 10–15 digits, optional leading +. No spaces.');
    if (f.get('role')?.hasError('required'))        errs.push('Role is required.');
    return errs;
  }

  onSubmit(): void {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMsg.set("");

    const { confirmPassword, ...payload } = this.form.value;

    this.usersApi.create(payload as CreateUserRequest).subscribe({
      next: (createdUser) => {
        this.saving.set(false);
        this.snackbar.open(`User "${createdUser.fullName}" created successfully.`, "Close", { duration: 3000 });
        this.dialogRef.close(createdUser);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(this.extractError(err, "Failed to create user."));
      },
    });
  }

  onCancel(): void { this.dialogRef.close(null); }

  togglePassword(): void        { this.showPassword.update((v) => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update((v) => !v); }

  private extractError(err: any, fallback: string): string {
    return err?.error?.message || err?.error?.title || err?.message || fallback;
  }
}