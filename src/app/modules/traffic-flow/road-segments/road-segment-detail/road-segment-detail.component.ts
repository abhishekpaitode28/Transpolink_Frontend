import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import ActivatedRoute from '@angular/router'
// TODO: import RoadSegmentService, TrafficFlowService
// TODO: import RoadSegment, TrafficFlow from models
// TODO: import StatusBadgeComponent, TrafficFlowChartComponent

@Component({
  selector: 'tl-road-segment-detail',
  standalone: true,
  imports: [RouterLink],
  // TODO: also import StatusBadgeComponent, TrafficFlowChartComponent
  templateUrl: './road-segment-detail.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadSegmentDetailComponent implements OnInit {

  // TODO: private route          = inject(ActivatedRoute)
  // TODO: private segmentService = inject(RoadSegmentService)
  // TODO: private flowService    = inject(TrafficFlowService)

  // TODO: segment = signal<RoadSegment | null>(null)
  // TODO: flows   = signal<TrafficFlow[]>([])

  ngOnInit(): void {
    // TODO: get 'id' from route.snapshot.paramMap
    // TODO: call segmentService.getById(id) → set segment signal
    // TODO: call flowService.getBySegment(id) → set flows signal
  }
}
