// routes/route-detail/route-detail.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransportRouteService } from '../../services/transport-route.service';
import { ScheduleService } from '../../services/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../identity/auth/auth.service';
import { TransportRoute } from '../../models/transport-route.model';
import { Schedule } from '../../models/schedule.model';
import { computed } from '@angular/core';

@Component({
  selector: 'tl-route-detail',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule, MatIconModule, MatCardModule,
    MatTableModule, MatProgressSpinnerModule,
  ],
  templateUrl: './route-detail.component.html',
})
export class RouteDetailComponent implements OnInit {
  private activeRoute    = inject(ActivatedRoute);
  private router         = inject(Router);
  private routeService   = inject(TransportRouteService);
  private scheduleService = inject(ScheduleService);
  private notify         = inject(NotificationService);
  private auth           = inject(AuthService);

  routeId   = signal('');
  route     = signal<TransportRoute | null>(null);
  schedules = signal<Schedule[]>([]);
  loading   = signal(false);
  error     = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'TransportOperator'].includes(this.auth.currentRole() ?? '')
  );

  readonly scheduleColumns = ['departureTime', 'arrivalTime', 'status'];

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    console.log(id);
    
    this.routeId.set(id);
    this.loadAll(id);
  }

  loadAll(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.routeService.getById(id).subscribe({
      next: data => {
        this.route.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Route not found.');
        this.loading.set(false);
      },
    });

    this.scheduleService.getByRoute(id).subscribe({
      
      next: data => this.schedules.set(data),
      error: () => {},
    });
  }

  goBack(): void {
    this.router.navigate(['/transport']);
  }

  editRoute(): void {
    this.router.navigate(['/transport/routes', this.routeId(), 'edit']);
  }

  addSchedule(): void {
    this.router.navigate(['/transport/schedules/new'],
      { queryParams: { routeId: this.routeId() } });
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Active' : 'Inactive';
  }

  getStatusClass(status: number): string {
    return status === 0 ? 'tl-badge tl-badge--open' : 'tl-badge tl-badge--closed';
  }

  getScheduleStatusClass(status: string): string {
    const map: Record<string, string> = {
      OnTime:   'tl-badge tl-badge--open',
      Delayed:  'tl-badge tl-badge--incident',
      Active:   'tl-badge tl-badge--free',
      Inactive: 'tl-badge tl-badge--closed',
    };
    return map[status] ?? 'tl-badge';
  }
}