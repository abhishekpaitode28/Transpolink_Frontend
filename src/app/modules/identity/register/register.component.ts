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
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'tl-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltip
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  readonly theme = inject(ThemeService);

  loading      = signal<boolean>(false);
  error        = signal<string>('');
  success      = signal<boolean>(false);
  hidePassword = signal<boolean>(true);

  form: FormGroup = this.fb.group({
    fullName:    ['', [Validators.required, Validators.maxLength(100)]],
    email:       ['', [Validators.required, Validators.email]],
    password:    ['', [Validators.required, Validators.minLength(8)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
  });

  onRegister(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // Role is always Civilian — never exposed to the user
    const payload = {
      ...this.form.value,
      role: 'Civilian',
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        // Redirect to login after 2 seconds
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(
          err.error?.message ?? 'Registration failed. Please try again.'
        );
      },
    });
  }
}