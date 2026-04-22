import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import TrafficFlowService
// TODO: import TrafficFlow from models
// TODO: import StatusBadgeComponent from shared

@Component({
  selector: 'tl-traffic-flow-list',
  standalone: true,
  imports: [DatePipe],
  // TODO: also import StatusBadgeComponent
  templateUrl: './traffic-flow-list.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficFlowListComponent implements OnInit {

  // TODO: private svc = inject(TrafficFlowService)

  // TODO: flows   = signal<TrafficFlow[]>([])
  // TODO: loading = signal(true)

  ngOnInit(): void {
    // TODO: call svc.getAll().subscribe(...)
    //   next:  set flows signal, set loading to false
    //   error: set loading to false
  }
}
