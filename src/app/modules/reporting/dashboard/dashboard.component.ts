import { Component, OnInit } from '@angular/core';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import ReportingService and Report interface

@Component({
  selector: 'tl-reporting-dashboard',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO: Build the reporting & analytics dashboard
         Sections:
           1. Summary cards — total incidents, active segments, transport routes, compliance pass rate
           2. Reports table — scope badge, generatedDate, metrics summary
           3. "Generate Report" buttons for each scope (Incident / Transport / Traffic)
         Show loading state while reports are fetching -->
  `,
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  // TODO: private svc = inject(ReportingService)

  // TODO: reports = signal<Report[]>([])
  // TODO: loading = signal(true)

  ngOnInit(): void {
    // TODO: call svc.getReports().subscribe(...)
    //   next: set reports signal, set loading false
    //   error: set loading false
  }

  generate(scope: string): void {
    // TODO: call svc.generate(scope).subscribe(...)
    //   next: prepend the new report to the reports signal
    //         show success toast
  }
}
