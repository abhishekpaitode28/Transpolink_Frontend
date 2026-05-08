import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FleetAssignmentService } from '../../services/fleet-assignment.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FleetAssignment } from '../../models/fleet-assignment.model';
 
@Component({
  selector: 'tl-assignment-list',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, MatMenuModule,
  ],
  templateUrl: './assignment-list.component.html',
})
export class AssignmentListComponent implements OnInit {
  private assignmentService = inject(FleetAssignmentService);
  private router            = inject(Router);
  private auth              = inject(AuthService);
  private notify            = inject(NotificationService);
 
  assignments   = signal<FleetAssignment[]>([]);
  loading       = signal(false);
  error         = signal('');
  actionLoading = signal<string | null>(null);
 
  readonly canEdit = computed(() =>
    ['Admin', 'TransportOperator'].includes(this.auth.currentRole() ?? '')
  );
 
  readonly displayedColumns = ['vehicleType', 'routeName', 'departureTime', 'vehicleStatus', 'actions'];
 
  ngOnInit(): void { this.loadAll(); }
 
  loadAll(): void {
    this.loading.set(true);
    this.error.set('');
    this.assignmentService.getAll().subscribe({
      next:  data => { this.assignments.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Failed to load assignments.'); this.loading.set(false); },
    });
  }
 
  createNew(): void { this.router.navigate(['/transport/assignments/new']); }
 
  goToLive(): void { this.router.navigate(['/transport/live']); }
 
  startTrip(a: FleetAssignment): void {
    this.actionLoading.set(a.id);
    this.assignmentService.startTrip(a.id).subscribe({
      next:  () => { this.actionLoading.set(null); this.notify.success('Trip started.'); this.loadAll(); },
      error: err => { this.actionLoading.set(null); this.notify.error(err.error?.message ?? 'Failed to start trip.'); },
    });
  }
 
  completeTrip(a: FleetAssignment): void {
    this.actionLoading.set(a.id);
    this.assignmentService.completeTrip(a.id).subscribe({
      next:  () => { this.actionLoading.set(null); this.notify.success('Trip completed.'); this.loadAll(); },
      error: err => { this.actionLoading.set(null); this.notify.error(err.error?.message ?? 'Failed to complete trip.'); },
    });
  }
 
  reportDelay(a: FleetAssignment): void {
    const input = prompt('Enter delay in minutes:');
    const mins  = parseInt(input ?? '0', 10);
    if (!mins || isNaN(mins) || mins <= 0) return;
 
    this.actionLoading.set(a.id);
    this.assignmentService.reportDelay(a.id, mins).subscribe({
      next:  () => { this.actionLoading.set(null); this.notify.success(`Delay of ${mins} mins reported.`); this.loadAll(); },
      error: err => { this.actionLoading.set(null); this.notify.error(err.error?.message ?? 'Failed to report delay.'); },
    });
  }
 
  removeAssignment(a: FleetAssignment): void {
    if (!confirm('Remove this assignment? The vehicle will be released.')) return;
    this.assignmentService.remove(a.id).subscribe({
      next:  () => { this.notify.success('Assignment removed.'); this.loadAll(); },
      error: () => this.notify.error('Failed to remove assignment.'),
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