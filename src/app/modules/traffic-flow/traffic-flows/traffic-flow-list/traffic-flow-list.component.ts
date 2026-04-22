import { Component, OnInit, signal } from '@angular/core';
import { TrafficFlowService } from '../../services/traffic-flow.service';
import { TrafficFlow } from '../../models/traffic-flow.model';
import { DatePipe } from '@angular/common';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'tl-traffic-flow-list',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  templateUrl: './traffic-flow-list.component.html',
})
export class TrafficFlowListComponent implements OnInit {
  flows   = signal<TrafficFlow[]>([]);
  loading = signal(true);

  constructor(private flowService: TrafficFlowService) {}

  ngOnInit() {
    this.flowService.getAll().subscribe({
      next:  (data) => { this.flows.set(data); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }
}
