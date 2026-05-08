// schedules/schedule-form/schedule-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ScheduleService } from '../../services/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'tl-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent implements OnInit {
  private activeRoute     = inject(ActivatedRoute);
  private router          = inject(Router);
  private fb              = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);
  private notify          = inject(NotificationService);

  isEditMode  = signal(false);
  scheduleId  = signal('');
  loading     = signal(false);
  saving      = signal(false);
  error       = signal('');

  form: FormGroup = this.fb.group({
    transportID:   ['', Validators.required],
    departureTime: ['', Validators.required],
    arrivalTime:   ['', Validators.required],
    status:        [6,  Validators.required],
  });

  ngOnInit(): void {
    // Pre-fill routeId if navigated from route detail
    const routeId = this.activeRoute.snapshot.queryParamMap.get('routeId');
    if (routeId) this.form.patchValue({ transportID: routeId });

    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.scheduleId.set(id);
      this.loadSchedule(id);
    }
  }

  loadSchedule(id: string): void {
    this.loading.set(true);
    this.scheduleService.getById(id).subscribe({
      next: data => {
        this.form.patchValue({
          transportID:   data.transportID,
          departureTime: data.departureTime?.slice(0, 16),
          arrivalTime:   data.arrivalTime?.slice(0, 16),
        });
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load schedule.'); this.loading.set(false); },
    });
  }

onSubmit(): void {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }

  this.saving.set(true);
  this.error.set('');
  const payload = this.form.value;

  if (this.isEditMode()) {
    this.scheduleService.update(this.scheduleId(), payload as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Schedule updated.');
        this.router.navigate(['/transport/schedules']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? 'Failed to save schedule.');
        this.notify.error('Failed to save schedule.');
      },
    });
  } else {
    this.scheduleService.create(payload as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Schedule created.');
        this.router.navigate(['/transport/schedules']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? 'Failed to save schedule.');
        console.log(this.error());
        
        this.notify.error('Failed to save schedule.');
      },
    });
  }
}

  goBack(): void { this.router.navigate(['/transport/schedules']); }
}