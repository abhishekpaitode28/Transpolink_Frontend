import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../services/compliance.service';
import { ToastService } from '../../../core/services/toast.service';
import { IncidentService } from '../../incidents/services/incident.service';
import { TransportRouteService } from '../../transport/services/transport-route.service';
import { Incident } from '../../incidents/models/incident.model';
import { TransportRoute } from '../../transport/models/transport-route.model';

@Component({
  selector: 'tl-record-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './record-form.component.html',
})
export class RecordFormComponent implements OnInit {

  private svc             = inject(ComplianceService);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private toast           = inject(ToastService);
  private incidentService = inject(IncidentService);
  private routeService    = inject(TransportRouteService);

  saving         = signal(false);
  error          = signal('');
  loadingOptions = signal(false);

  incidents = signal<Incident[]>([]);
  routes    = signal<TransportRoute[]>([]);

  auditId = this.route.snapshot.paramMap.get('id')!;

  form = {
    auditId:  this.auditId,
    entityId: '',
    type:     'Incident',
    result:   'Pending',
    notes:    '',
  };

  typeOptions   = ['Incident', 'Transport'];
  resultOptions = [ 'Pass', 'Fail', 'Pending'];

  // Only actionable incidents (closed/resolved/cancelled don't need new records)
  openIncidents = computed(() =>
    this.incidents().filter(i => i.status === 'Open' || i.status === 'Pending'),
  );

  // Only Active routes (status === 0)
  activeRoutes = computed(() =>
    this.routes().filter(r => r.status === 0),
  );

  ngOnInit(): void {
    this.loadOptions();
  }

  private loadOptions(): void {
    this.loadingOptions.set(true);
    let pending = 2;
    const done = () => { if (--pending === 0) this.loadingOptions.set(false); };

    // pageSize set high enough to fill a dropdown in one shot
    this.incidentService.getAll({ pageSize: 500 }).subscribe({
      next: (page) => { this.incidents.set(page.items ?? []); done(); },
      error: ()    => done(),
    });

    this.routeService.getAll().subscribe({
      next: (data) => { this.routes.set(data ?? []); done(); },
      error: ()    => done(),
    });
  }

  onTypeChange(t: string): void {
    if (this.form.type === t) return;
    this.form.type = t;
    this.form.entityId = '';   // reset selection so the GUID doesn't leak across types
    this.error.set('');
  }

  getIncidentLabel(i: Incident): string {
    const code = `INC-${i.id.slice(0, 4).toUpperCase()}`;
    return `${code} · ${i.type} at ${i.location} · ${i.status}`;
  }

  getRouteLabel(r: TransportRoute): string {
    const code = `RT-${r.id.slice(0, 4).toUpperCase()}`;
    return `${code} · ${r.startPoint} → ${r.endpoint} (${r.type})`;
  }

  submit(): void {
    if (!this.form.entityId.trim()) {
      this.error.set(
        this.form.type === 'Incident'
          ? 'Please select an incident.'
          : 'Please select a route.',
      );
      return;
    }
    this.saving.set(true);
    this.error.set('');

    this.svc.createRecord(this.form).subscribe({
      next: () => {
        this.toast.success('Record added successfully!');
        setTimeout(() => {
          this.router.navigate(['/compliance', this.auditId]);
        }, 1500);
      },
      error: () => {
        this.toast.error('Failed to create record.');
        this.saving.set(false);
      },
    });
  }
}
