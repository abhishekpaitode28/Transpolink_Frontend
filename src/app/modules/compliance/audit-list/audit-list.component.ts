import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplianceService, Audit } from '../services/compliance.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'tl-audit-list',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './audit-list.component.html',
})
export class AuditListComponent {

  private svc = inject(ComplianceService);

  audits = toSignal(this.svc.getAudits(), { initialValue: [] as Audit[] });
}