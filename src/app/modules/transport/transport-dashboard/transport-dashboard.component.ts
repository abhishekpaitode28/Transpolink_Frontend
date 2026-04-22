import { Component, OnInit } from '@angular/core';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import TransportService (and interfaces: TransportRoute, Schedule, Fleet)

@Component({
  selector: 'tl-transport-dashboard',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO: Build the transport dashboard
         Sections:
           1. Routes table — type (Bus/Train), startPoint → endPoint, status badge
           2. Schedules table — routeId, departureTime, arrivalTime, status badge
           3. Fleet table — vehicleType, capacity, status badge
         Show a loading state for each section while data is fetching -->
  `,
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportDashboardComponent implements OnInit {

  // TODO: private svc = inject(TransportService)

  // TODO: routes    = signal<TransportRoute[]>([])
  // TODO: schedules = signal<Schedule[]>([])
  // TODO: fleet     = signal<Fleet[]>([])
  // TODO: loading   = signal(true)

  ngOnInit(): void {
    // TODO: call svc.getRoutes(), svc.getSchedules(), svc.getFleet()
    // TODO: use forkJoin to load all three in parallel, then set signals
  }
}
