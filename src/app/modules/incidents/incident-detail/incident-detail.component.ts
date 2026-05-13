import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, computed,
  inject, OnInit, signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService }          from '../../identity/auth/auth.service';
import { NotificationService }  from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IncidentService }      from '../services/incident.service';
import { ResolutionService }    from '../services/resolution.service';
import { Incident, IncidentStatus } from '../models/incident.model';

@Component({
  selector:    'tl-incident-detail',
  standalone:  true,
  imports: [DatePipe, FormsModule, StatusBadgeComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl:    './incident-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDetailComponent implements OnInit {
  private route              = inject(ActivatedRoute);
  private router             = inject(Router);
  private incidentService    = inject(IncidentService);
  private resolutionService  = inject(ResolutionService);
  private notify             = inject(NotificationService);
  private auth               = inject(AuthService);

  // ── Incident state ────────────────────────────────────────────────────────
  readonly incident = signal<Incident | null>(null);
  readonly loading  = signal(true);
  readonly saving   = signal(false);
  readonly error    = signal('');

  // ── Resolve modal state ───────────────────────────────────────────────────
  readonly showResolveModal = signal(false);
  resolveActions            = '';
  resolveDate               = new Date().toISOString().slice(0, 16); // default now

  // ── Permissions ───────────────────────────────────────────────────────────
  readonly canResolve = computed(() =>
    this.auth.currentRole() === 'TrafficOfficer' ||
    this.auth.currentRole() === 'Admin'
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────
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
        if (!incident) this.error.set('Incident not found.');
      },
      error: () => {
        this.error.set('Failed to load incident details.');
        this.loading.set(false);
        this.notify.error('Failed to load incident details');
      },
    });
  }

  // ── Open / close resolve modal ────────────────────────────────────────────
  openResolveModal(): void {
    this.resolveActions = '';
    this.resolveDate    = new Date().toISOString().slice(0, 16);
    this.showResolveModal.set(true);
  }

  closeResolveModal(): void {
    this.showResolveModal.set(false);
  }

  // ── Submit resolution ─────────────────────────────────────────────────────
  // Step 1: POST /api/resolutions/{incidentId}
  //   → creates Resolution record in DB
  //   → calls TrafficService.ResolveIncidentAsync → HasActiveIncident = false
  //   → sends notification
  //
  // Step 2: PATCH /api/incidents/{id}/status → Resolved
  //   → updates incident status
  submitResolution(): void {
    const current = this.incident();

    if (!current) return;

    if (!this.resolveActions.trim()) {
      this.notify.error('Please describe the actions taken');
      return;
    }

    if (!this.resolveDate) {
      this.notify.error('Please select a resolution date');
      return;
    }

    this.saving.set(true);

    // Step 1 — Create resolution record
    this.resolutionService.create(current.id, {
      actions: this.resolveActions.trim(),
      date:    new Date(this.resolveDate).toISOString(),
    }).subscribe({
      next: () => {
        // Step 2 — Update incident status to Resolved
        this.incidentService.updateStatus(current.id, 'Resolved').subscribe({
          next: updated => {
            if (updated) this.incident.set(updated);

            this.saving.set(false);
            this.showResolveModal.set(false);
            this.notify.success('Incident resolved successfully');

            // Navigate back — list reloads with updated status
            this.router.navigate(['/incident']);
          },
          error: () => {
            // Resolution was created but status update failed
            this.notify.error('Resolution saved but status update failed');
            this.saving.set(false);
            this.showResolveModal.set(false);
          }
        });
      },
      error: () => {
        this.notify.error('Failed to create resolution');
        this.saving.set(false);
      }
    });
  }

  back(): void {
    this.router.navigate(['/incident']);
  }

  isTerminal(status: IncidentStatus): boolean {
    return status === 'Resolved' || status === 'Closed' || status === 'Cancelled';
  }
}