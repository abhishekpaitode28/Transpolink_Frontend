// schedules/schedule-list/schedule-list.component.ts
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduleService } from '../../services/schedule.service';
import { AuthService } from '../../../identity/auth/auth.service'; 
import { NotificationService } from '../../../../core/services/notification.service';
import { Schedule } from '../../models/schedule.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'tl-schedule-list',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,SlicePipe],
  templateUrl: './schedule-list.component.html',
})
export class ScheduleListComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private router          = inject(Router);
  private auth            = inject(AuthService);
  private notify          = inject(NotificationService);

  schedules = signal<Schedule[]>([]);
  loading   = signal(false);
  error     = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'TransportOperator'].includes(this.auth.currentRole() ?? '')
  );

  readonly displayedColumns = ['transportID', 'departureTime', 'arrivalTime', 'status', 'actions'];

  ngOnInit(): void { this.loadSchedules(); }

  loadSchedules(): void {
    this.loading.set(true);
    this.scheduleService.getAll().subscribe({
      next:  data => { this.schedules.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Failed to load schedules.'); this.loading.set(false); },
    });
  }

  createNew(): void { this.router.navigate(['/transport/schedules/new']); }

  editSchedule(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/transport/schedules', id, 'edit']);
  }

  deleteSchedule(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Delete this schedule?')) return;
    this.scheduleService.delete(id).subscribe({
      next:  () => { this.notify.success('Schedule deleted.'); this.loadSchedules(); },
      error: () => this.notify.error('Failed to delete schedule.'),
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      OnTime:   'tl-badge tl-badge--open',
      Delayed:  'tl-badge tl-badge--incident',
      Active:   'tl-badge tl-badge--free',
      Inactive: 'tl-badge tl-badge--closed',
    };
    return map[status] ?? 'tl-badge';
  }
}