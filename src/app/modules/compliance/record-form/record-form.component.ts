import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../services/compliance.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'tl-record-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './record-form.component.html',
})
export class RecordFormComponent {

  private svc    = inject(ComplianceService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private toast  = inject(ToastService);

  saving  = signal(false);
  error   = signal('');

  auditId = this.route.snapshot.paramMap.get('id')!;

  form = {
    auditId:  this.auditId,
    entityId: '',
    type:     'Incident',
    result:   'Active',
    notes:    '',
  };

  typeOptions   = ['Incident', 'Transport'];
  resultOptions = ['Active', 'Inactive', 'Pass', 'Fail', 'Pending'];

  submit(): void {
    if (!this.form.entityId.trim()) {
      this.error.set('Entity ID is required.');
      return;
    }
    this.saving.set(true);
    this.error.set('');

    this.svc.createRecord(this.form).subscribe({
      next: () => {
        this.toast.success('Record added successfully!');
        setTimeout(() => {
          this.router.navigate(['/compliance', this.auditId]);
        }, 1500);
      },
      error: () => {
        this.toast.error('Failed to create record.');
        this.saving.set(false);
      },
    });
  }
}