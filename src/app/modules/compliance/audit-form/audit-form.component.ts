import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../services/compliance.service';
import { AuthService } from '../../identity/auth/auth.service';

@Component({
  selector: 'tl-audit-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './audit-form.component.html',
})
export class AuditFormComponent {

  private svc    = inject(ComplianceService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  saving = signal(false);
  error  = signal('');

  form = {
    officerId: this.auth.currentUser()?.id ?? '',
    scope:     '',
    status:    1,
  };

  statusOptions = [
    { label: 'Active',   value: 0 },
    { label: 'Inactive', value: 1 },
    { label: 'Pending',  value: 2 },
    { label: 'Open',     value: 3 },
    { label: 'Closed',   value: 11 },
  ];

  submit(): void {
    if (!this.form.scope.trim()) {
      this.error.set('Scope is required.');
      return;
    }
    this.saving.set(true);
    this.error.set('');

    this.svc.createAudit(this.form).subscribe({
      next:  (audit) => { this.router.navigate(['/compliance', audit.id]); },
      error: ()      => { this.error.set('Failed to create audit.'); this.saving.set(false); },
    });
  }
}