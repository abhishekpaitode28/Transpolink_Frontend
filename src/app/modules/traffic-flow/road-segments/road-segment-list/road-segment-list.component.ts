import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// TODO: import signal, computed, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import RoadSegmentService
// TODO: import RoadSegment, TrafficStatus from models
// TODO: import StatusBadgeComponent, TrafficStatusPipe from shared
// TODO: import NotificationService

@Component({
  selector: 'tl-road-segment-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  // TODO: also import StatusBadgeComponent, TrafficStatusPipe
  templateUrl: './road-segment-list.component.html',
  styleUrls: ['./road-segment-list.component.scss'],
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadSegmentListComponent implements OnInit {

  // TODO: private svc    = inject(RoadSegmentService)
  // TODO: private notify = inject(NotificationService)

  // TODO: private _segments = signal<RoadSegment[]>([])
  // TODO: loading            = signal(true)
  // TODO: filter             = signal('')          ← text search
  // TODO: statusFilter       = signal('')          ← dropdown filter

  // TODO: filtered = computed(() => filter _segments by filter() and statusFilter())

  // TODO: statuses = Object.values(TrafficStatus)  ← for the status dropdown

  ngOnInit(): void {
    // TODO: call this.load()
  }

  load(): void {
    // TODO: set loading to true
    // TODO: call svc.getAll().subscribe(...)
    //   next:  set _segments, set loading false
    //   error: set loading false
  }

  delete(id: string): void {
    // TODO: confirm with the user before deleting
    // TODO: call svc.delete(id).subscribe(...)
    //   next:  remove the segment from _segments signal, show success toast
    //   error: show error toast
  }
}
