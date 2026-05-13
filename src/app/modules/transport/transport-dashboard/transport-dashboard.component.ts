import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TransportRouteService } from '../services/transport-route.service';
import { ScheduleService } from '../services/schedule.service';
import { FleetService } from '../services/fleet.service';
import { TransportRoute } from '../models/transport-route.model';
import { Schedule } from '../models/schedule.model';
import { Fleet } from '../models/fleet.model';

@Component({
  selector: 'tl-transport-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transport-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportDashboardComponent implements OnInit {
  private routeService    = inject(TransportRouteService);
  private scheduleService = inject(ScheduleService);
  private fleetService    = inject(FleetService);

  routes    = signal<TransportRoute[]>([]);
  schedules = signal<Schedule[]>([]);
  fleet     = signal<Fleet[]>([]);
  loading   = signal(true);
  error     = signal('');

  readonly routeColumns    = ['type', 'route', 'status'];
  readonly scheduleColumns = ['routeId', 'departureTime', 'arrivalTime', 'status'];
  readonly fleetColumns    = ['vehicleType', 'capacity', 'status'];

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      routes:    this.routeService.getAll(),
      schedules: this.scheduleService.getAll(),
      fleet:     this.fleetService.getAll(),
    }).subscribe({
      next: ({ routes, schedules, fleet }) => {
        this.routes.set(routes);
        this.schedules.set(schedules);
        this.fleet.set(fleet);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transport data.');
        this.loading.set(false);
      },
    });
  }

  getRouteStatusClass(status: number): string {
    return status === 0 ? 'tl-badge tl-badge--open' : 'tl-badge tl-badge--closed';
  }

  getRouteStatusLabel(status: number): string {
    return status === 0 ? 'Active' : 'Inactive';
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

  getFleetStatusClass(status: string): string {
    const map: Record<string, string> = {
      Available:        'tl-badge tl-badge--open',
      InService:        'tl-badge tl-badge--free',
      UnderMaintenance: 'tl-badge tl-badge--incident',
    };
    return map[status] ?? 'tl-badge';
  }

  getServiceCode(id: string): string {
    if (!id) return 'RT-0000';
    return `RT-${id.slice(0, 4).toUpperCase()}`;
  }
}
