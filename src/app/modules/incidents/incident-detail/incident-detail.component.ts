import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IncidentService } from '../services/incident.service';
import { Incident, IncidentStatus } from '../models/incident.models';

@Component({
  selector: 'tl-incident-detail',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidentService = inject(IncidentService);
  private notify = inject(NotificationService);
  private auth = inject(AuthService);

  readonly incident = signal<Incident | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly canResolve = computed(() => this.auth.currentRole() === 'TrafficOfficer');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Incident id is missing.');
      this.loading.set(false);
      return;
    }

    this.incidentService.getById(id).subscribe({
      next: incident => {
        this.incident.set(incident);
        this.loading.set(false);

        if (!incident) {
          this.error.set('Incident not found.');
        }
      },
      error: () => {
        this.error.set('Failed to load incident details.');
        this.loading.set(false);
        this.notify.error('Failed to load incident details');
      },
    });
  }

  resolve(): void {
    const current = this.incident();

    if (!current || current.status === 'Resolved') {
      return;
    }

    this.saving.set(true);

    this.incidentService.updateStatus(current.id, 'Resolved').subscribe({
      next: updated => {
        if (updated) {
          this.incident.set(updated);
        }

        this.notify.success('Incident marked as resolved.');
        this.saving.set(false);
      },
      error: () => {
        this.notify.error('Failed to update incident status.');
        this.saving.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/incident']);
  }

  isTerminal(status: IncidentStatus): boolean {
    return status === 'Resolved' || status === 'Closed' || status === 'Cancelled';
  }
}
