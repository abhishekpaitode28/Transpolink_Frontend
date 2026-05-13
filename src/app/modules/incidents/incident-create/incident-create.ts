import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NotificationService }  from '../../../core/services/notification.service';
import { IncidentService }       from '../services/incident.service';
import { RoadSegmentService }    from '../../traffic-flow/services/road-segment.service';
import { RoadSegment }           from '../../traffic-flow/models/road-segment.model';
import { StatusType }            from '../../traffic-flow/models/traffic-status.enum';
import { IncidentType }          from '../models/incident.model';

@Component({
  selector:    'tl-incident-create',
  standalone:  true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-create.html',
  styleUrl:    './incident-create.scss',
})
export class IncidentCreateComponent implements OnInit {
  private notify          = inject(NotificationService);
  private incidentService = inject(IncidentService);
  private segmentService  = inject(RoadSegmentService);
  private router          = inject(Router);

  saving          = signal(false);
  loadingSegments = signal(false);
  segments        = signal<RoadSegment[]>([]);

  readonly activeSegments = computed(() =>
    this.segments().filter(s => s.status === StatusType.Active)
  );


  readonly selectedSegment = computed(() =>
    this.segments().find(s => s.id === this.roadSegmentId) ?? null
  );

  // Warning if segment already has active incident
  readonly segmentHasIncident = computed(() =>
    this.selectedSegment()?.hasActiveIncident ?? false
  );

  // Placeholder text changes based on whether segment is selected
  readonly locationPlaceholder = computed(() =>
    this.roadSegmentId
      ? 'Add specific detail (optional) — e.g. near Gemini Flyover, southbound lane'
      : 'e.g. Anna Salai near Gemini Flyover'
  );

  // Incident types
  readonly incidentTypes: IncidentType[] = ['Accident', 'Breakdown', 'Roadblock'];

  // ── Form fields ────────────────────────────────────────────────────────────
  type: IncidentType    = 'Accident';
  location              = '';
  date                  = '';
  roadSegmentId: string = '';

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadSegments();
  }

  private loadSegments(): void {
    this.loadingSegments.set(true);

    this.segmentService.getAll().subscribe({
      next: data => {
        this.segments.set(data);
        this.loadingSegments.set(false);
      },
      error: () => {
        this.loadingSegments.set(false);
        this.notify.warning(
          'Could not load road segments. You can still report without linking one.'
        );
      },
    });
  }

  // ── Segment selection handler — auto-fills location ───────────────────────
  onSegmentChange(): void {
    const seg = this.selectedSegment();

    if (seg) {
      // Pre-fill location with segment name
      // User can still edit to add more specific detail
      this.location = seg.location;
    } else {
      // Deselected — clear so user types fresh
      this.location = '';
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────
  private isValid(): boolean {
    if (!this.date) {
      this.notify.error('Incident date and time is required');
      return false;
    }

    // Location required only when no segment selected
    // When segment is selected, location is auto-filled from segment
    if (!this.roadSegmentId && !this.location.trim()) {
      this.notify.error('Please enter a location or select a road segment');
      return false;
    }

    return true;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  submit(): void {
    if (!this.isValid()) return;

    this.saving.set(true);

    // Final location:
    // If user typed something → use that (might be extra detail on top of segment name)
    // If nothing typed but segment selected → fall back to segment location
    // If nothing → empty (validation already caught this)
    const finalLocation =
      this.location.trim() || this.selectedSegment()?.location || '';

    this.incidentService.create({
      type:          this.type,
      location:      finalLocation,
      date:          new Date(this.date).toISOString(),
      roadSegmentId: this.roadSegmentId || null,
    }).subscribe({
      next: () => {
        // If segment was linked → set HasActiveIncident = true on Traffic service
        if (this.roadSegmentId) {
          this.segmentService.notifyIncident(this.roadSegmentId).subscribe({
            error: () => {} // silent — incident already created successfully
          });
        }

        this.notify.success('Incident reported successfully');
        this.router.navigate(['/incident']);
      },
      error: () => {
        this.notify.error('Failed to report incident');
        this.saving.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/incident']);
  }
}