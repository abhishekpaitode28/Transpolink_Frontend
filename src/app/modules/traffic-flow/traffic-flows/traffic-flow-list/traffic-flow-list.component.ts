import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TrafficFlowService } from '../../services/traffic-flow.service';
import { TrafficFlow, TrafficFlowFilter } from '../../models/traffic-flow.model';

@Component({
  selector: 'tl-traffic-flow-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatCardModule, MatTooltipModule,
  ],
  templateUrl: './traffic-flow-list.component.html',
  styleUrl: './traffic-flow-list.component.scss',
})
export class TrafficFlowListComponent implements OnInit {
  private flowService = inject(TrafficFlowService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  flows = signal<TrafficFlow[]>([]);
  loading = signal(false);
  error = signal('');

  readonly statusOptions = ['Active', 'Free', 'Moderate', 'Congested', 'Blocked'];
  readonly displayedColumns = [
    'observationDate', 'roadSegmentId', 'volume', 'speed', 'status', 'incident'
  ];

  filterForm: FormGroup = this.fb.group({
    roadSegmentId: [''],
    startDate: [null],
    endDate: [null],
    status: [''],
  });

  ngOnInit(): void {
    const segId = this.route.snapshot.queryParamMap.get('roadSegmentId');
    if (segId) this.filterForm.patchValue({ roadSegmentId: segId });
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading.set(true);
    this.error.set('');

    const raw = this.filterForm.value;
    const filter: TrafficFlowFilter = {
      roadSegmentId: raw.roadSegmentId  || undefined,
      startDate: raw.startDate
        ? new Date(raw.startDate).toISOString() : undefined,
      endDate: raw.endDate
        ? new Date(raw.endDate).toISOString()   : undefined,
      status: raw.status || undefined,
    };

    this.flowService.getHistory(filter).subscribe({
      next: data => {
        this.flows.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load traffic flow history.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadHistory();
  }

  getFlowStatusClass(status: string): string {
    const map: Record<string, string> = {
      Free: 'tl-badge tl-badge--free',
      Moderate: 'tl-badge tl-badge--moderate',
      Congested: 'tl-badge tl-badge--congested',
      Blocked: 'tl-badge tl-badge--blocked',
      Active: 'tl-badge tl-badge--open',
    };
    return map[status] ?? 'tl-badge';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'Z').toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}