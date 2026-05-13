import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators,
} from "@angular/forms";

import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatSnackBar }              from '@angular/material/snack-bar';

import { AuthService } from "../../auth/auth.service";
import { UserSevice } from '../../services/user.service';
import { roleLabel }   from '../../../../shared/constants/role.constants';

function strongPassword(ctrl: AbstractControl): ValidationErrors | null {
  const v = ctrl.value ?? '';
  if (!v) return null;
  const ok = /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v);
  return ok ? null : { weakPassword: true };
}

function newPasswordRules(group: AbstractControl): ValidationErrors | null {
  const current = group.get('currentPassword')?.value;
  const next    = group.get('newPassword')?.value;
  const confirm = group.get('confirmNewPassword')?.value;

  const errors: ValidationErrors = {};
  if (current && next && current === next)  errors['sameAsCurrent']   = true;
  if (next && confirm && next !== confirm)  errors['passwordMismatch'] = true;
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'tl-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule, MatTabsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls:    ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private fb       = inject(FormBuilder);
  private auth     = inject(AuthService);
  private users    = inject(UserSevice);
  private snackbar = inject(MatSnackBar);

  loadingProfile  = signal(false);
  savingprofile   = signal(false);
  savingPassword  = signal(false);
  loggingOutAll   = signal(false);
  confirmLogout   = signal(false);

  profileSubmitAttempted  = signal(false);
  passwordSubmitAttempted = signal(false);

  errorProfile  = signal(' ');
  errorPassword = signal(' ');

  userId   = signal('');
  email    = signal('');
  role     = signal('');
  isActive = signal(true);
  showCurrentPassword = signal(false);
  showNewPassword     = signal(false);
  showConfirmPassword = signal(false);

  roleLabel = roleLabel;

  profileForm: FormGroup = this.fb.group({
    fullName:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:       ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
  });

  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword:    ['', [Validators.required]],
      newPassword:        ['', [Validators.required, Validators.minLength(8), strongPassword]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: newPasswordRules },
  );

  ngOnInit(): void { this.loadProfile(); }

  passwordMatchStatus(): 'match' | 'mismatch' | 'pending' {
    const np = this.passwordForm.get('newPassword')?.value;
    const cp = this.passwordForm.get('confirmNewPassword')?.value;
    if (!np || !cp) return 'pending';
    return np === cp ? 'match' : 'mismatch';
  }

  getProfileErrors(): string[] {
    if (!this.profileSubmitAttempted()) return [];
    const errs: string[] = [];
    const f = this.profileForm;
    if (f.get('fullName')?.hasError('required'))  errs.push('Full name is required.');
    if (f.get('fullName')?.hasError('minlength')) errs.push('Full name must be at least 2 characters.');
    if (f.get('fullName')?.hasError('maxlength')) errs.push('Full name must be at most 100 characters.');
    if (f.get('email')?.hasError('required'))     errs.push('Email is required.');
    if (f.get('email')?.hasError('email'))        errs.push('Enter a valid email address.');
    if (f.get('phoneNumber')?.hasError('required')) errs.push('Phone is required.');
    if (f.get('phoneNumber')?.hasError('pattern'))  errs.push('Phone must be 10–15 digits, optional leading +. No spaces.');
    return errs;
  }

  getPasswordErrors(): string[] {
    if (!this.passwordSubmitAttempted()) return [];
    const errs: string[] = [];
    const f = this.passwordForm;
    if (f.get('currentPassword')?.hasError('required')) errs.push('Current password is required.');
    if (f.get('newPassword')?.hasError('required'))     errs.push('New password is required.');
    if (f.get('newPassword')?.hasError('minlength'))    errs.push('New password must be at least 8 characters.');
    if (f.get('newPassword')?.hasError('weakPassword')) errs.push('New password must include uppercase, lowercase, and a digit.');
    if (f.get('confirmNewPassword')?.hasError('required')) errs.push('Please confirm your new password.');
    if (f.hasError('passwordMismatch')) errs.push('New password and confirm password do not match.');
    if (f.hasError('sameAsCurrent'))    errs.push('New password must be different from the current password.');
    return errs;
  }

  private loadProfile(): void {
    const me = this.auth.currentUser();
    if (!me) { this.errorProfile.set('Not logged in!'); return; }
    if (me.role === 'Citizen') {
      this.userId.set(me.id);
      this.email.set(me.email);
      this.role.set(me.role);
      this.isActive.set(me.isActive);
      this.profileForm.patchValue({
        fullName:    me.fullName,
        email:       me.email,
        phoneNumber: me.phone,
      });
      return;
    }

    this.loadingProfile.set(true);
    this.errorProfile.set(' ');

    this.users.getById(me.id).subscribe({
      next: user => {
        this.loadingProfile.set(false);
        this.userId.set(user.id);
        this.email.set(user.email);
        this.role.set(user.role);
        this.isActive.set(user.isActive);
        this.profileForm.patchValue({
          fullName:    user.fullName,
          email:       user.email,
          phoneNumber: user.phone,
        });
      },
      error: err => {
        this.loadingProfile.set(false);
        this.userId.set(me.id);
        this.email.set(me.email);
        this.role.set(me.role);
        this.isActive.set(me.isActive);
        this.profileForm.patchValue({
          fullName:    me.fullName,
          email:       me.email,
          phoneNumber: me.phone,
        });
        this.errorProfile.set(this.extractError(err, 'failed to load profile.'));
      },
    });
  }

  private extractError(err: any, fallback: string): string {
    return err?.error?.message || err?.error?.title || err?.message || fallback;
  }

  onUpdateProfile(): void {
    this.profileSubmitAttempted.set(true);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.savingprofile.set(true);
    this.errorProfile.set(' ');

    this.users.update(this.userId(), this.profileForm.value).subscribe({
      next: user => {
        this.savingprofile.set(false);
        this.profileSubmitAttempted.set(false);
        this.email.set(user.email);
        this.snackbar.open('Profile updated successfully', 'Close', { duration: 3000 });
      },
      error: err => {
        this.savingprofile.set(false);
        this.errorProfile.set(this.extractError(err, 'Could not update profile!'));
      },
    });
  }

  onChangePassword(): void {
    this.passwordSubmitAttempted.set(true);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.savingPassword.set(true);
    this.errorPassword.set(' ');

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.users.changePassword(this.userId(), { currentPassword, newPassword }).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordSubmitAttempted.set(false);
        this.passwordForm.reset();

        // Show success message, then sign the user out from every device
        // (security best practice: invalidates any session using a token
        //  issued under the old password). The auth service handles the
        //  redirect to /login.
        this.snackbar.open(
          'Password changed successfully. Signing you out for security…',
          'Close',
          { duration: 4000 },
        );

        setTimeout(() => {
          this.auth.logoutFromAllDevices().subscribe({
            next: () => { /* auth service redirects to /login */ },
            error: () => {
              // If the backend logout call fails for any reason, fall back
              // to a local logout so the user still ends up on /login.
              this.auth.logout();
            },
          });
        }, 1500);
      },
      error: err => {
        this.savingPassword.set(false);
        const msg = this.extractError(err, 'failed to change password!');
        const friendly = /current.*password|incorrect|wrong/i.test(msg)
          ? 'Current password is incorrect. Please try again.'
          : msg;
        this.errorPassword.set(friendly);
      },
    });
  }

  askLogoutAll(): void { this.confirmLogout.set(true); }
  doLogoutAll(): void {
    this.loggingOutAll.set(true);
    this.auth.logoutFromAllDevices().subscribe({
      next: () => {},
      error: err => {
        this.loggingOutAll.set(false);
        this.confirmLogout.set(false);
        this.snackbar.open(this.extractError(err, 'failed to logout from all devices!'), 'Close', { duration: 4000 });
      },
    });
  }

  toggleCurrentPassword(): void { this.showCurrentPassword.update(v => !v); }
  toggleNewPassword(): void     { this.showNewPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }
}