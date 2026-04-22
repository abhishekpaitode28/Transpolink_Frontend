import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import IncidentService to get total incident count
// TODO: import RoadSegmentService to get total segment count
// TODO: import NotificationsService to get unread count
// TODO: import forkJoin from 'rxjs'

@Component({
  selector: 'tl-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  // TODO: inject the three services above

  // TODO: Declare summary card signals:
  //   totalIncidents   = signal(0)
  //   totalSegments    = signal(0)
  //   unreadAlerts     = signal(0)
  //   loading          = signal(true)

  ngOnInit(): void {
    // TODO: use forkJoin to call all three services in parallel
    // TODO: on success — set each signal from the response data lengths
    // TODO: set loading to false in both next and error handlers
  }
}
