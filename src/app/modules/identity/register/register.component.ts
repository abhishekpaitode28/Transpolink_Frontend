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
import { MatDividerModule }         from '@angular/material/divider';

import { AuthService } from '../../../core/auth/auth.service';

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

  loading      = signal(false);
  error        = signal('');
  showPassword = signal(false);

  form: FormGroup = this.fb.group({
    fullName:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:       ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
    password:    ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // Send exactly what RegisterDto expects
    // fullName, email, password, phoneNumber — NO role
    this.auth.register(this.form.value).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          // register auto-logs in — navigate to home
          this.router.navigate(['/home']);
        } else {
          this.error.set(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message
          || err?.error?.title
          || 'Registration failed. Please try again.';
        this.error.set(msg);
      },
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}