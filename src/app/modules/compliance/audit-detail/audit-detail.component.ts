import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ComplianceService, Audit } from '../services/compliance.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'tl-audit-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent, FormsModule],
  templateUrl: './audit-detail.component.html',
})
export class AuditDetailComponent {

  private svc   = inject(ComplianceService);
  private route = inject(ActivatedRoute);

  audit = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.svc.getAuditById(params.get('id')!)
      )
    ),
    { initialValue: undefined }
  );

  // ── Update form ───────────────────────────────────────────────────────────
  showUpdateForm = signal(false);
  saving         = signal(false);
  updateError    = signal('');

  updateForm = {
    findings: '',
    status:   1,
  };

  statusOptions = [
    { label: 'Active',   value: 0  },
    { label: 'Inactive', value: 1  },
    { label: 'Pending',  value: 2  },
    { label: 'Open',     value: 3  },
    { label: 'Closed',   value: 11 },
  ];

  openUpdateForm(): void {
    this.updateForm.findings = this.audit()?.findings ?? '';
    this.updateForm.status   = 1;
    this.showUpdateForm.set(true);
  }

  submitUpdate(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.saving.set(true);
    this.updateError.set('');

    this.svc.updateAudit(id, this.updateForm).subscribe({
      next:  () => { window.location.reload(); },
      error: ()  => {
        this.updateError.set('Failed to update audit.');
        this.saving.set(false);
      },
    });
  }

  // ── Delete record ─────────────────────────────────────────────────────────
  deletingRecord = signal<string | null>(null);

  deleteRecord(recordId: string): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
    this.deletingRecord.set(recordId);

    this.svc.deleteRecord(recordId).subscribe({
      next:  () => { window.location.reload(); },
      error: ()  => {
        alert('Failed to delete record.');
        this.deletingRecord.set(null);
      },
    });
  }
}