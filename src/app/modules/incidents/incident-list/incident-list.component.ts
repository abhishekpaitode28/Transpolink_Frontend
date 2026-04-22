import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentService, Incident } from '../services/incident.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'tl-incident-list',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './incident-list.component.html',
})
export class IncidentListComponent implements OnInit {
  incidents = signal<Incident[]>([]);
  loading   = signal(true);

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.incidentService.getAll().subscribe({
      next:  (data) => { this.incidents.set(data); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }
}
