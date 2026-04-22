import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService, Incident } from '../services/incident.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'tl-incident-detail',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './incident-detail.component.html',
})
export class IncidentDetailComponent implements OnInit {
  incident = signal<Incident | null>(null);

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.incidentService.getById(id).subscribe((data) => this.incident.set(data));
  }

  resolve() {
    const id = this.incident()?.id;
    if (!id) return;
    this.incidentService.updateStatus(id, 'Resolved').subscribe({
      next: (updated) => {
        this.incident.set(updated);
        this.notify.success('Incident resolved — road segment status updated via domain event.');
      },
    });
  }
}
