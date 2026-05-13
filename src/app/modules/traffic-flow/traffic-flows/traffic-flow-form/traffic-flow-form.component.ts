import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { TrafficFlowService } from '../../services/traffic-flow.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'tl-traffic-flow-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  templateUrl: './traffic-flow-form.component.html',
  styleUrl:    './traffic-flow-form.component.scss',
})
export class TrafficFlowFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private flowService = inject(TrafficFlowService);
  private notify = inject(NotificationService);

  saving = signal(false);
  error = signal('');
  segmentId = signal('');

  form: FormGroup = this.fb.group({
    roadSegmentId: ['', Validators.required],
    volume: [null, [Validators.required, Validators.min(0), Validators.max(99999)]],
    speed: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
    date: ['', Validators.required],
  });

  ngOnInit(): void {
    this.form.patchValue({ date: this.getLocalDateTimeString() });
    const segId = this.route.snapshot.queryParamMap.get('segmentId');
    if (segId) {
      this.segmentId.set(segId);
      this.form.patchValue({ roadSegmentId: segId });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const raw = this.form.value;
    const payload = {
      roadSegmentId: raw.roadSegmentId,
      volume: Number(raw.volume),
      speed: Number(raw.speed),
      date: raw.date + ':00',  
    };

    this.flowService.recordFlow(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Traffic flow recorded successfully');
        // Navigate back to segment detail if we came from one
        if (this.segmentId()) {
          this.router.navigate(['/traffic-flow/segment', this.segmentId()]);
        } else {
          this.router.navigate(['/traffic-flow/history']);
        }
      },
      error: () => {
        this.error.set('Failed to record traffic flow. Please try again.');
        this.saving.set(false);
        this.notify.error("Failed to create road segment")
      },
    });
  }

  goBack(): void {
    this.segmentId()
      ? this.router.navigate(['/traffic-flow/segment', this.segmentId()])
      : this.router.navigate(['/traffic-flow']);
  }

  private getLocalDateTimeString(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const local  = new Date(now.getTime() - offset);
    return local.toISOString().slice(0, 16);
  }
}