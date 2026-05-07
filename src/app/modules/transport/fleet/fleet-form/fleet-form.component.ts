// fleet/fleet-form/fleet-form.component.ts
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
import { FleetService } from '../../services/fleet.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FleetStatus } from '../../models/transport-status.enum';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'tl-fleet-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  templateUrl: './fleet-form.component.html',
})
export class FleetFormComponent implements OnInit {
  private activeRoute  = inject(ActivatedRoute);
  private router       = inject(Router);
  private fb           = inject(FormBuilder);
  private fleetService = inject(FleetService);
  private notify       = inject(NotificationService);
  private auth         = inject(AuthService);

  isEditMode = signal(false);
  fleetId    = signal('');
  loading    = signal(false);
  saving     = signal(false);
  error      = signal('');

  readonly statusOptions = [
    { label: 'Available',         value: 8  },
    { label: 'In Service',        value: 9  },
    { label: 'Under Maintenance', value: 10 },
  ];

  form: FormGroup = this.fb.group({
    vehicleType: ['',  [Validators.required, Validators.maxLength(50)]],
    capacity:    [null,[Validators.required, Validators.min(1)]],
    status:      [8,   Validators.required],
  });

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.fleetId.set(id);
      this.loadFleet(id);
    }
  }

  loadFleet(id: string): void {
    this.loading.set(true);
    this.fleetService.getById(id).subscribe({
      next: data => {
        const statusInt = this.statusOptions.find(s => s.label.replace(' ', '') === data.status)?.value ?? 8;
        this.form.patchValue({
          vehicleType: data.vehicleType,
          capacity:    data.capacity,
          status:      statusInt,
        });
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load vehicle.'); this.loading.set(false); },
    });
  }

onSubmit(): void {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }

  this.saving.set(true);
  this.error.set('');
  const payload = this.form.value;

  if (this.isEditMode()) {
    // Update returns boolean
    this.fleetService.update(this.fleetId(), payload as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Vehicle updated.');
        this.router.navigate(['/transport/fleet']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? 'Failed to save vehicle.');
        this.notify.error('Failed to save vehicle.');
      },
    });
  } else {
    // Create returns Fleet
    this.fleetService.create({
      ...payload as any,
      operatorID: this.auth.currentUser()?.id ?? '',
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success('Vehicle added.');
        this.router.navigate(['/transport/fleet']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.error?.errors?.[0] ?? 'Failed to save vehicle.');
        this.notify.error('Failed to save vehicle.');
      },
    });
  }
}

  goBack(): void { this.router.navigate(['/transport/fleet']); }
}