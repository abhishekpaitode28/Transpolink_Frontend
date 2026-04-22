import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import IncidentService and Incident interface
// TODO: import StatusBadgeComponent from shared

@Component({
  selector: 'tl-incident-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  // TODO: also import StatusBadgeComponent
  templateUrl: './incident-list.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentListComponent implements OnInit {

  // TODO: private svc = inject(IncidentService)

  // TODO: incidents = signal<Incident[]>([])
  // TODO: loading   = signal(true)

  ngOnInit(): void {
    // TODO: call svc.getAll().subscribe(...)
    //   next:  set incidents signal, set loading to false
    //   error: set loading to false
  }
}
