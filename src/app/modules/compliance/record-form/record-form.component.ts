import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../services/compliance.service';

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
      next:  () =>   { this.router.navigate(['/compliance', this.auditId]); },
      error: () =>   { this.error.set('Failed to create record.'); this.saving.set(false); },
    });
  }
}