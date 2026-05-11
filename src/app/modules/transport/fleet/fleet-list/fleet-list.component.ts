// fleet/fleet-list/fleet-list.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FleetService } from '../../services/fleet.service';
import { AuthService } from '../../../identity/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Fleet } from '../../models/fleet.model';

@Component({
  selector: 'tl-fleet-list',
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatTooltipModule,
    SlicePipe,UpperCasePipe
  ],
  templateUrl: './fleet-list.component.html',
  styles: [
  `
  .tl-segment-table {
    .mat-column-fleetCode {
      flex: 0 0 100px;
      padding-right: 16px !important;
    }

    .fleet-code-badge {
      font-family: 'SFMono-Regular', Consolas, monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: #2563eb; 
      background-color: rgba(37, 99, 235, 0.08); 
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgba(37, 99, 235, 0.2);
      display: inline-block;
      white-space: nowrap;
    }
  }

  mat-header-cell {
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  `
]
})
export class FleetListComponent implements OnInit {
  private fleetService = inject(FleetService);
  private router       = inject(Router);
  private auth         = inject(AuthService);
  private notify       = inject(NotificationService);

  fleets     = signal<Fleet[]>([]);
  loading    = signal(false);
  error      = signal('');
  searchText = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'TransportOperator'].includes(this.auth.currentRole() ?? '')
  );

  readonly filteredFleets = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if (!q) return this.fleets();
    return this.fleets().filter(f =>
      f.vehicleType.toLowerCase().includes(q) ||
      f.status.toLowerCase().includes(q)
    );
  });

  readonly displayedColumns = ['fleetCode','vehicleType', 'capacity', 'status', 'createdAt', 'actions'];

  ngOnInit(): void { this.loadFleets(); }

  loadFleets(): void {
    this.loading.set(true);
    this.error.set('');
    this.fleetService.getAll().subscribe({
      next:  data => { this.fleets.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Failed to load fleet.'); this.loading.set(false); },
    });
  }

  createNew(): void  { this.router.navigate(['/transport/fleet/new']); }

  editFleet(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/transport/fleet', id, 'edit']);
  }

  deleteFleet(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Remove this vehicle from the fleet?')) return;
    this.fleetService.delete(id).subscribe({
      next: () => { this.notify.success('Vehicle removed.'); this.loadFleets(); },
      error: () => this.notify.error('Failed to remove vehicle.'),
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Available:        'tl-badge tl-badge--open',
      InService:        'tl-badge tl-badge--free',
      UnderMaintenance: 'tl-badge tl-badge--incident',
    };
    return map[status] ?? 'tl-badge';
  }
}