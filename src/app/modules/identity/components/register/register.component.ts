import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators,
} from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';

import { AuthService } from '../../auth/auth.service';

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
  selector: 'tl-register',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl:    './register.component.scss',
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  loading             = signal(false);
  error               = signal('');
  showPassword        = signal(false);
  showConfirmPassword = signal(false);
  submitAttempted     = signal(false);

  form: FormGroup = this.fb.group(
    {
      fullName:        ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email:           ['', [Validators.required, Validators.email]],
      phoneNumber:     ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      password:        ['', [Validators.required, Validators.minLength(8), strongPassword]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  // Live password-match indicator — shows once both fields have values.
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
    if (f.get('phoneNumber')?.hasError('required')) errs.push('Phone number is required.');
    if (f.get('phoneNumber')?.hasError('pattern'))  errs.push('Phone must be 10–15 digits, optional leading +. No spaces.');
    if (f.get('password')?.hasError('required'))    errs.push('Password is required.');
    if (f.get('password')?.hasError('minlength'))   errs.push('Password must be at least 8 characters.');
    if (f.get('password')?.hasError('weakPassword')) errs.push('Password must include uppercase, lowercase, and a digit.');
    if (f.get('confirmPassword')?.hasError('required')) errs.push('Please confirm your password.');
    if (f.hasError('passwordMismatch'))             errs.push('Password and confirm password do not match.');
    return errs;
  }

  onSubmit(): void {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { confirmPassword, ...payload } = this.form.value;

    this.auth.register(payload).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.router.navigate(['/home']);
        else this.error.set(res.message || 'Registration failed.');
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.error?.title || 'Registration failed. Please try again.';
        this.error.set(msg);
      },
    });
  }

  togglePassword(): void        { this.showPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }
}