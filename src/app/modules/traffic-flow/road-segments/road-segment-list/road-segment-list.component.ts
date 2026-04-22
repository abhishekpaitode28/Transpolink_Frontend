import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoadSegmentService } from '../../services/road-segment.service';
import { RoadSegment } from '../../models/road-segment.model';
import { TrafficStatus } from '../../models/traffic-status.enum';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { TrafficStatusPipe } from '../../../../shared/pipes/traffic-status.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'tl-road-segment-list',
  standalone: true,
  imports: [RouterLink, FormsModule, StatusBadgeComponent, TrafficStatusPipe],
  templateUrl: './road-segment-list.component.html',
  styleUrls: ['./road-segment-list.component.scss'],
})
export class RoadSegmentListComponent implements OnInit {
  private _segments = signal<RoadSegment[]>([]);
  loading   = signal(true);
  filter    = signal<string>('');
  statusFilter = signal<string>('');

  filtered = computed(() => {
    const q = this.filter().toLowerCase();
    const s = this.statusFilter();
    return this._segments().filter((seg) => {
      const matchName = !q || seg.name.toLowerCase().includes(q);
      const matchStatus = !s || seg.status === s;
      return matchName && matchStatus;
    });
  });

  statuses = Object.values(TrafficStatus);

  constructor(
    private segmentService: RoadSegmentService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.segmentService.getAll().subscribe({
      next:  (data) => { this._segments.set(data); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }

  delete(id: string) {
    if (!confirm('Delete this road segment?')) return;
    this.segmentService.delete(id).subscribe({
      next: () => {
        this._segments.update((list) => list.filter((s) => s.id !== id));
        this.notify.success('Road segment deleted.');
      },
      error: () => this.notify.error('Failed to delete road segment.'),
    });
  }
}
