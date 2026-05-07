import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FleetAssignmentService } from '../services/fleet-assignment.service';
import { LiveFleet } from '../models/fleet-assignment.model';

@Component({
  selector: 'tl-live-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule,
  ],
  templateUrl: './live-dashboard.component.html',
})
export class LiveDashboardComponent implements OnInit {
  private assignmentService = inject(FleetAssignmentService);
  private router            = inject(Router);

  fleet   = signal<LiveFleet[]>([]);
  loading = signal(false);
  error   = signal('');

  readonly displayedColumns = ['vehicleType', 'routeName', 'scheduledArrival', 'tripStatus', 'alert'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.assignmentService.getLiveDashboard().subscribe({
      next:  data => { this.fleet.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Failed to load live fleet.'); this.loading.set(false); },
    });
  }

  goBack(): void { this.router.navigate(['/transport/assignments']); }

  delayedCount(): number {
    return this.fleet().filter(f => f.isDelayed).length;
  }

  getTripStatusClass(isDelayed: boolean): string {
    return isDelayed ? 'tl-badge tl-badge--incident' : 'tl-badge tl-badge--free';
  }
}
