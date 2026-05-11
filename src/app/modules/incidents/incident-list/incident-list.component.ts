import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IncidentService } from '../services/incident.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../identity/auth/auth.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Incident, IncidentQuery, IncidentStatus, IncidentType } from '../models/incident.model';

@Component({
  selector: 'tl-incident-list',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentListComponent implements OnInit {
  private svc = inject(IncidentService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router)

  readonly incidents = signal<Incident[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly totalCount = signal(0);
  readonly typeFilter = signal<IncidentType | ''>('');
  readonly statusFilter = signal<IncidentStatus | ''>('');

  readonly incidentTypes: IncidentType[] = ['Accident', 'Breakdown', 'Roadblock'];
  readonly incidentStatuses: IncidentStatus[] = ['Open', 'Pending', 'Resolved', 'Closed', 'Cancelled'];

  readonly isCitizen = computed(() => this.auth.currentRole() === 'Citizen');
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  readonly canReport = computed(() =>
    this.auth.currentRole() === 'Citizen' || this.auth.currentRole() === 'TrafficOfficer'
  );

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(page = this.page()): void {
    this.loading.set(true);
    this.error.set('');

    const query: IncidentQuery = {
      page,
      pageSize: this.pageSize(),
      type: this.typeFilter() || undefined,
      status: this.statusFilter() || undefined,
    };

    const request$ = this.isCitizen()
      ? this.svc.getMyReports(query)
      : this.svc.getAll(query);

    request$.subscribe({
      next: response => {
        this.incidents.set(response.items);
        this.totalCount.set(response.totalCount);
        this.page.set(response.page);
        this.pageSize.set(response.pageSize);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load incidents.');
        this.loading.set(false);
        this.notify.error('Failed to load incidents');
      },
    });
  }

  applyFilters(): void {
    this.loadIncidents(1);
  }

  clearFilters(): void {
    this.typeFilter.set('');
    this.statusFilter.set('');
    this.loadIncidents(1);
  }

  refresh(): void {
    this.loadIncidents(this.page());
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.loadIncidents(this.page() - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.loadIncidents(this.page() + 1);
    }
  }

  reportIncident(): void{
    this.router.navigate(['/incident/create']);
  }

}