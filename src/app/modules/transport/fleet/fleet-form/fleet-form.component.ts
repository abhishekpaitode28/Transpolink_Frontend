// fleet/fleet-form/fleet-form.component.ts
import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { AuthService } from '../../../identity/auth/auth.service';

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
  private destroyRef   = inject(DestroyRef);

  isEditMode = signal(false);
  fleetId    = signal('');
  loading    = signal(false);
  saving     = signal(false);
  error      = signal('');

  readonly statusOptions = [
    { label: 'Available',         value: 8  },
    // { label: 'In Service',        value: 9  },
    { label: 'Under Maintenance', value: 10 },
  ];

  readonly fleetTypes: string[] = [
    'Standard City Bus',
    'Mini Bus',
    'Double Decker Bus',
    'Electric Bus',
    'Tram',
    'Metro Train',
    'Suburban Train',
    'Diesel Multiple Unit',
    'Monorail',
    'High Speed Train',
    'Passenger Train',
  ];

  // Realistic capacity ranges (seats) per vehicle type
  readonly capacityRanges: Record<string, { min: number; max: number }> = {
    'Standard City Bus':      { min: 30,  max: 80   },
    'Mini Bus':               { min: 8,   max: 25   },
    'Midi Bus':               { min: 25,  max: 45   },
    'Articulated Bus':        { min: 60,  max: 180  },
    'Double Decker Bus':      { min: 60,  max: 120  },
    'Electric Bus':           { min: 30,  max: 80   },
    'Hybrid Bus':             { min: 30,  max: 80   },
    'Trolleybus':             { min: 30,  max: 100  },
    'BRT Vehicle':            { min: 60,  max: 160  },
    'Tram':                   { min: 100, max: 250  },
    'Light Rail Vehicle':     { min: 150, max: 400  },
    'Metro Train':            { min: 500, max: 2000 },
    'Suburban Train':         { min: 400, max: 2000 },
    'Diesel Multiple Unit':   { min: 200, max: 800  },
    'Monorail':               { min: 100, max: 300  },
    'High Speed Train':       { min: 300, max: 1200 },
    'Passenger Train':        { min: 300, max: 1500 },
    'Guided Bus':             { min: 50,  max: 120  },
    'Trackless Tram':         { min: 100, max: 300  },
    'Automated People Mover': { min: 50,  max: 200  },
  };

  private readonly DEFAULT_RANGE = { min: 1, max: 2000 };

  selectedType = signal<string>('');

  currentRange = computed(() =>
    this.capacityRanges[this.selectedType()] ?? this.DEFAULT_RANGE
  );

  form: FormGroup = this.fb.group({
    vehicleType: ['',   [Validators.required, Validators.maxLength(50)]],
    capacity:    [null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    status:      [8,    Validators.required],
  });

  ngOnInit(): void {
    // Re-apply capacity validators whenever the vehicle type changes
    this.form.get('vehicleType')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type: string) => {
        this.selectedType.set(type ?? '');
        this.applyCapacityValidators();
      });

    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.fleetId.set(id);
      this.loadFleet(id);
    }
  }

  private applyCapacityValidators(): void {
    const range = this.currentRange();
    const ctrl = this.form.get('capacity');
    if (!ctrl) return;
    ctrl.setValidators([
      Validators.required,
      Validators.min(range.min),
      Validators.max(range.max),
      Validators.pattern(/^\d+$/),
    ]);
    ctrl.updateValueAndValidity();
  }

  loadFleet(id: string): void {
    this.loading.set(true);
    this.fleetService.getById(id).subscribe({
      next: data => {
        const statusInt = this.statusOptions.find(s => s.label.replace(' ', '') === data.status)?.value ?? 8;
        // Setting vehicleType first triggers valueChanges → validators reapply
        // before capacity is patched.
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