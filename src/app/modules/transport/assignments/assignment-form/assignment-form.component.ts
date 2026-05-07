import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FleetAssignmentService } from '../../services/fleet-assignment.service';
import { FleetService } from '../../services/fleet.service';
import { ScheduleService } from '../../services/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Fleet } from '../../models/fleet.model';
import { Schedule } from '../../models/schedule.model';
 
@Component({
  selector: 'tl-assignment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatSelectModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  templateUrl: './assignment-form.component.html',
})
export class AssignmentFormComponent implements OnInit {
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);
  private assignmentService = inject(FleetAssignmentService);
  private fleetService      = inject(FleetService);
  private scheduleService   = inject(ScheduleService);
  private notify            = inject(NotificationService);
 
  saving      = signal(false);
  loadingData = signal(false);
  error       = signal('');
 
  vehicles  = signal<Fleet[]>([]);
  schedules = signal<Schedule[]>([]);
 
  form: FormGroup = this.fb.group({
    fleetID:    ['', Validators.required],
    scheduleID: ['', Validators.required],
  });
 
  ngOnInit(): void {
    this.loadingData.set(true);
    this.error.set('');
 
    // Pre-fill from query params if navigated from fleet or schedule page
    const preFleetId    = this.route.snapshot.queryParams['fleetId'];
    const preScheduleId = this.route.snapshot.queryParams['scheduleId'];
 
    forkJoin({
      vehicles:  this.fleetService.getAvailable(),
      schedules: this.scheduleService.getAll(),
    }).subscribe({
      next: ({ vehicles, schedules }) => {
        this.vehicles.set(vehicles);
        this.schedules.set(schedules);
        this.loadingData.set(false);
 
        if (preFleetId)    this.form.patchValue({ fleetID: preFleetId });
        if (preScheduleId) this.form.patchValue({ scheduleID: preScheduleId });
      },
      error: () => {
        this.error.set('Failed to load vehicles or schedules.');
        this.loadingData.set(false);
      },
    });
  }
 
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.error.set('');
 
    this.assignmentService.assign(this.form.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Vehicle assigned successfully.');
        this.router.navigate(['/transport/assignments']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? err.error?.message ?? 'Failed to assign vehicle.');
        this.notify.error(this.error());
      },
    });
  }
 
  goBack(): void { this.router.navigate(['/transport/assignments']); }

}