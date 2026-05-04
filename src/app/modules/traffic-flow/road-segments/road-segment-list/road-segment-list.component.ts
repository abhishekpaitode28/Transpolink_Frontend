import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoadSegmentService } from '../../services/road-segment.service';
import { TrafficFlowService } from '../../services/traffic-flow.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationsService } from '../../../notifications/services/notifications.service';
import { RoadSegment } from '../../models/road-segment.model';
import { TrafficFlow } from '../../models/traffic-flow.model';
import { filter } from 'rxjs';
import { StatusType } from '../../models/traffic-status.enum';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatInputModule }           from '@angular/material/input';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatChipsModule }           from '@angular/material/chips';

@Component({
  selector: 'tl-road-segment-list',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatTableModule, MatIconModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule],
  templateUrl: './road-segment-list.component.html',
  styleUrl: './road-segment-list.component.scss',
  
})
export class RoadSegmentListComponent implements OnInit {
  private segmentService = inject(RoadSegmentService);
  private flowService = inject(TrafficFlowService);
  private router = inject (Router);
  private auth = inject(AuthService);
  private notify = inject(NotificationsService);

  segments = signal<RoadSegment[]>([]);
  latestFlows = signal<Map<string, TrafficFlow>>(new Map());
  loading = signal(false);
  error = signal('');
  searchText = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'TrafficOfficer'].includes(this.auth.currentRole() ?? '')
  );

  readonly filteredSegments = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if(!q) return this.segments();
    return this.segments().filter(s=>s.location.toLowerCase().includes(q));
  });

  readonly displayedColumns = ['location', 'length', 'status', 'incident', 'latestFlow', 'actions'];

  ngOnInit(): void {
    this.loadSegments();
  }
  
  loadSegments() : void {
    this.loading.set(true);
    this.error.set('');

    this.segmentService.getAll().subscribe({
      next: data => {
        this.segments.set(data);
        this.loading.set(false);

        data.forEach(seg => this.loadLatestFlow(seg.id));
      },
      error: () => {
        this.error.set('Failed to load road segments');
        this.loading.set(false);
      }
    });
  }

  private loadLatestFlow(segmentId: string): void{
    this.flowService.getLatest(segmentId).subscribe({
      next: flow => {
        if(flow){
          this.latestFlows.update(map => {
            const next = new Map(map);
            next.set(segmentId, flow);
            return next;
          })
        }
      },
      error: () => {}
    });
  }

  getLatestFlow(segmentId: string): TrafficFlow | undefined {
    return this.latestFlows().get(segmentId);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/traffic-flow/segment', id]);
  }

  createNew() : void {
    this.router.navigate(['/traffic-flow/segment/new']);
  }

  editSegment(id: string, event: Event) : void{
    event.stopPropagation();
    this.router.navigate(['/traffic-flow/segment', id, 'edit'])
  }

  getSegmentStatusClass(status: StatusType): string{
    const map: Record<string, string> = {
      [StatusType.Active]:'tl-badge tl-badge--open',
      [StatusType.Inactive]:'tl-badge tl-badge--closed',
      [StatusType.UnderMaintenance]:'tl-badge tl-badge--moderate'
    };
    return map[status] ?? 't1-badge';
  }

  getFlowStatusClass(status: string): string{
    const map: Record<string, string> = {
      Free:'tl-badge tl-badge--free',
      Moderate:'tl-badge tl-badge--moderate',
      Congested:'tl-badge tl-badge--congested',
      Blocked:'tl-badge tl-badge--blocked',
    };
    return map[status] ?? 't1-badge';
  }

}
