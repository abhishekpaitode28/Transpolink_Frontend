import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatDividerModule }         from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule }           from '@angular/material/table';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatTooltipModule }         from '@angular/material/tooltip';

import { RoadSegmentService } from '../../services/road-segment.service';
import { TrafficFlowService }  from '../../services/traffic-flow.service';
import { RoadSegmentPayload }  from '../../models/road-segment.model';
import { TrafficFlow }         from '../../models/traffic-flow.model';
import { StatusType }          from '../../models/traffic-status.enum';
import { AuthService } from '../../../identity/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
@Component({
  selector: 'tl-road-segment-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatDividerModule, MatProgressSpinnerModule,
    MatTableModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule,
  ],
  templateUrl: './road-segment-detail.component.html',
  styleUrl:    './road-segment-detail.component.scss',
})
export class RoadSegmentDetailComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private segmentService = inject(RoadSegmentService);
  private flowService    = inject(TrafficFlowService);
  private auth           = inject(AuthService);
  private notify         = inject(NotificationService);

  segmentId = signal('');
  segment = signal<RoadSegmentPayload | null>(null);
  latest = signal<TrafficFlow | null>(null);
  flows = signal<TrafficFlow[]>([]);
  loading = signal(false);
  error = signal('');
  dateFilter  = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'Traffic Officer'].includes(this.auth.currentRole() ?? '')
  );

  readonly flowColumns = ['observationDate', 'volume', 'speed', 'status', 'incident'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.segmentId.set(id);
    this.loadAll(id);
  }

  loadAll(id: string): void {
    this.loading.set(true);
    this.error.set('');

    // Load segment details
    this.segmentService.getById(id).subscribe({
      next: seg => {
        this.segment.set(seg);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Road segment not found.');
        this.loading.set(false);
      },
    });

    // Load latest flow
    this.flowService.getLatest(id).subscribe({
      next:  flow => this.latest.set(flow),
      error: ()   => this.latest.set(null),
    });

    // Load flow history
    this.loadFlows(id);
  }

  loadFlows(id: string, date?: string): void {
    this.flowService.getBySegment(id, date).subscribe({
      next:  flows => this.flows.set(flows),
      error: ()    => this.notify.error('Failed to load traffic flows.'),
    });
  }

  applyDateFilter(): void {
    this.loadFlows(this.segmentId(), this.dateFilter() || undefined);
  }

  clearDateFilter(): void {
    this.dateFilter.set('');
    this.loadFlows(this.segmentId());
  }

  goBack(): void { this.router.navigate(['/traffic-flow']); }

  editSegment(): void {
    this.router.navigate(['/traffic-flow/segment', this.segmentId(), 'edit']);
  }

  recordFlow(): void {
    this.router.navigate(['/traffic-flow/record'],
      { queryParams: { segmentId: this.segmentId() } });
  }

  viewHistory(): void {
    this.router.navigate(['/traffic-flow/history'],
      { queryParams: { roadSegmentId: this.segmentId() } });
  }

  getFlowStatusClass(status: string): string {
    const map: Record<string, string> = {
      Free: 'tl-badge tl-badge--free',
      Moderate: 'tl-badge tl-badge--moderate',
      Congested: 'tl-badge tl-badge--congested',
      Blocked: 'tl-badge tl-badge--blocked',
      Active: 'tl-badge tl-badge--open',
    };
    return map[status] ?? 'tl-badge';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'Z').toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  formatDateShort(dateStr: string): string {
    return new Date(dateStr + 'Z').toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}