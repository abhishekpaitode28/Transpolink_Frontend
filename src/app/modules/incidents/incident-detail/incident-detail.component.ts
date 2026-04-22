import { Component, OnInit } from '@angular/core';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import ActivatedRoute from '@angular/router'
// TODO: import IncidentService, Incident
// TODO: import NotificationService from core
// TODO: import StatusBadgeComponent from shared

@Component({
  selector: 'tl-incident-detail',
  standalone: true,
  imports: [], // TODO: add StatusBadgeComponent
  templateUrl: './incident-detail.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentDetailComponent implements OnInit {

  // TODO: private route          = inject(ActivatedRoute)
  // TODO: private incidentService = inject(IncidentService)
  // TODO: private notify          = inject(NotificationService)

  // TODO: incident = signal<Incident | null>(null)

  ngOnInit(): void {
    // TODO: get the 'id' param from route.snapshot.paramMap
    // TODO: call incidentService.getById(id) and set the incident signal
  }

  resolve(): void {
    // TODO: get the id from incident()?.id — return early if null
    // TODO: call incidentService.updateStatus(id, 'Resolved').subscribe(...)
    //   next: update the signal with the returned updated incident
    //         show a success toast via notify.success(...)
  }
}
