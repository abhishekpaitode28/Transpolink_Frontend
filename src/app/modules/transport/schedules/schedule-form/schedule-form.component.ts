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
import { TransportRouteService } from '../../services/transport-route.service'; 
import { NotificationService } from '../../../../core/services/notification.service';
import { SlicePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'tl-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatDividerModule,SlicePipe,UpperCasePipe
  ],
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent implements OnInit {
  private activeRoute     = inject(ActivatedRoute);
  private router          = inject(Router);
  private fb              = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);
  private transportService = inject(TransportRouteService);
  private notify          = inject(NotificationService);

  isEditMode  = signal(false);
  scheduleId  = signal('');
  loading     = signal(false);
  loadingRoutes = signal(false);
  saving      = signal(false);
  error       = signal('');

  // Store available routes for the dropdown
  routes = signal<any[]>([]);

  form: FormGroup = this.fb.group({
    transportID:   ['', Validators.required],
    departureTime: ['', Validators.required],
    arrivalTime:   ['', Validators.required],
    status:        [6,  Validators.required],
  });

  ngOnInit(): void {
    this.loadRoutes();

    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.scheduleId.set(id);
      this.loadSchedule(id);
    } else {
      // If not editing, check for routeId in query params (autofill when coming from Route Detail)
      const routeId = this.activeRoute.snapshot.queryParamMap.get('routeId');
      if (routeId) this.form.patchValue({ transportID: routeId });
    }
  }

loadRoutes(): void {
  this.transportService.getAll().subscribe({
    next: (data) => {
      // Map the routes to include a professional display name
      const formattedRoutes = data.map(route => ({
        ...route,
        displayName: `RT-${route.id.slice(0, 4).toUpperCase()} (${route.startPoint} to ${route.endpoint})`
      }));
      
      this.routes.set(formattedRoutes);
    },
    error: () => this.error.set('Failed to load routes.')
  });
}

  loadSchedule(id: string): void {
    this.loading.set(true);
    this.scheduleService.getById(id).subscribe({
      next: data => {
        this.form.patchValue({
          transportID:   data.transportID,
          departureTime: data.departureTime?.slice(0, 16),
          arrivalTime:   data.arrivalTime?.slice(0, 16),
          status:        data.status
        });
        this.loading.set(false);
      },
      error: () => { 
        this.error.set('Failed to load schedule.'); 
        this.loading.set(false); 
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving.set(true);
    this.error.set('');
    const payload = this.form.getRawValue();

    const request$ = this.isEditMode() 
      ? this.scheduleService.update(this.scheduleId(), payload)
      : this.scheduleService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success(this.isEditMode() ? 'Schedule updated.' : 'Schedule created.');
        this.router.navigate(['/transport/schedules']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? 'Failed to save schedule.');
        this.notify.error('Failed to save schedule.');
      },
    });
  }

  goBack(): void { this.router.navigate(['/transport/schedules']); }
}