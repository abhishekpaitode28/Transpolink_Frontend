// routes/route-list/route-list.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransportRouteService } from '../../services/transport-route.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TransportRoute } from '../../models/transport-route.model';

@Component({
  selector: 'tl-route-list',
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatTooltipModule,
  ],
  templateUrl: './route-list.component.html',
})
export class RouteListComponent implements OnInit {
  private routeService = inject(TransportRouteService);
  private router       = inject(Router);
  private auth         = inject(AuthService);
  private notify       = inject(NotificationService);

  routes     = signal<TransportRoute[]>([]);
  loading    = signal(false);
  error      = signal('');
  searchText = signal('');

  readonly canEdit = computed(() =>
    ['Admin', 'TransportOperator'].includes(this.auth.currentRole() ?? '')
  );

  readonly filteredRoutes = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if (!q) return this.routes();
    return this.routes().filter(r =>
      r.startPoint.toLowerCase().includes(q) ||
      r.endpoint.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  readonly displayedColumns = ['type', 'startPoint', 'endpoint', 'status', 'actions'];

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.loading.set(true);
    this.error.set('');

    this.routeService.getAll().subscribe({
      next: data => {
        this.routes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load routes.');
        this.loading.set(false);
      },
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/transport/routes', id]);
  }

  createNew(): void {
    this.router.navigate(['/transport/routes/new']);
  }

  editRoute(id: string, event: Event): void {
    event.stopPropagation();
     console.log('id received:', id);
    this.router.navigate(['/transport/routes', id, 'edit']);
  }

  deleteRoute(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Delete this route? All associated schedules will also be deleted.')) return;

    this.routeService.delete(id).subscribe({
      next: () => {
        this.notify.success('Route deleted successfully.');
        this.loadRoutes();
      },
      error: () => this.notify.error('Failed to delete route.'),
    });
  }

  getStatusClass(status: number): string {
    return status === 0 ? 'tl-badge tl-badge--open' : 'tl-badge tl-badge--closed';
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Active' : 'Inactive';
  }
}