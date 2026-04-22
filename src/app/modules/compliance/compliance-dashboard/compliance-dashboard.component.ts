import { Component, OnInit } from '@angular/core';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import ComplianceService (and interfaces: ComplianceRecord, Audit)

@Component({
  selector: 'tl-compliance-dashboard',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO: Build the compliance dashboard
         Sections:
           1. Compliance Records table — entityId, type badge, result, date, notes
           2. Audits table — officerId, scope, findings, date, status badge
         Show loading state while data is fetching -->
  `,
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceDashboardComponent implements OnInit {

  // TODO: private svc = inject(ComplianceService)

  // TODO: records = signal<ComplianceRecord[]>([])
  // TODO: audits  = signal<Audit[]>([])
  // TODO: loading = signal(true)

  ngOnInit(): void {
    // TODO: use forkJoin to call svc.getRecords() and svc.getAudits() in parallel
    // TODO: set both signals on success, set loading to false in both next and error
  }
}
