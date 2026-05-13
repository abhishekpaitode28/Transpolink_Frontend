import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../auth/auth.service';
import { LoginRequest } from '../../auth/auth.models';

@Component({
  selector: 'tl-login',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl:    './login.component.scss',
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  loading         = signal(false);
  error           = signal('');
  showPassword    = signal(false);
  submitAttempted = signal(false);

  form: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  getErrors(): string[] {
    if (!this.submitAttempted()) return [];
    const errs: string[] = [];
    const f = this.form;
    if (f.get('email')?.hasError('required'))  errs.push('Email is required.');
    if (f.get('email')?.hasError('email'))     errs.push('Enter a valid email address.');
    if (f.get('password')?.hasError('required')) errs.push('Password is required.');
    if (f.get('password')?.hasError('minlength')) errs.push('Password must be at least 8 characters.');
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

    const payload: LoginRequest = this.form.value;

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.error?.title || 'Invalid email or password.';
        this.error.set(msg);
      },
    });
  }

  togglePassword(): void { this.showPassword.update(v => !v); }
}