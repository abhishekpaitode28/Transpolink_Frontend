import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoadSegmentService } from '../../services/road-segment.service';
import { TrafficFlowService } from '../../services/traffic-flow.service';
import { RoadSegment } from '../../models/road-segment.model';
import { TrafficFlow } from '../../models/traffic-flow.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { TrafficFlowChartComponent } from '../../traffic-flows/traffic-flow-chart/traffic-flow-chart.component';

@Component({
  selector: 'tl-road-segment-detail',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, TrafficFlowChartComponent],
  templateUrl: './road-segment-detail.component.html',
})
export class RoadSegmentDetailComponent implements OnInit {
  segment = signal<RoadSegment | null>(null);
  flows   = signal<TrafficFlow[]>([]);

  constructor(
    private route: ActivatedRoute,
    private segmentService: RoadSegmentService,
    private flowService: TrafficFlowService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.segmentService.getById(id).subscribe((s) => this.segment.set(s));
    this.flowService.getBySegment(id).subscribe((f) => this.flows.set(f));
  }
}
