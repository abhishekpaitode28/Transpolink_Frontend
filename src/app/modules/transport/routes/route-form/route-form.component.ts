// routes/route-form/route-form.component.ts
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
import { TransportRouteService } from '../../services/transport-route.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../identity/auth/auth.service';

@Component({
  selector: 'tl-route-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  templateUrl: './route-form.component.html',
})
export class RouteFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private routeService = inject(TransportRouteService);
  private notify = inject(NotificationService);
  private auth = inject(AuthService);

  isEditMode = signal(false);
  routeId = signal('');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  // Predefined transit hubs — kept in a signal so legacy values
  // loaded from the backend can be merged in on edit.
  locations = signal<string[]>([
    'Chennai',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Kolkata',
    'Coimbatore',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Visakhapatnam',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Erode',
    'Tirupati',
    'Mysuru',
    'Vijayawada',
    'Kochi',
    'Thiruvananthapuram',
    'Bhopal',
    'Indore',
    'Nagpur',
    'Surat',
  ]);

  form: FormGroup = this.fb.group({
    type: ['Bus', Validators.required],
    startPoint: ['', Validators.required],
    endpoint: ['', Validators.required],
    status: [0, Validators.required],
  });

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.routeId.set(id);
      this.loadRoute(id);
    }
  }

  loadRoute(id: string): void {
    this.loading.set(true);
    this.routeService.getById(id).subscribe({
      next: data => {
        // Merge any legacy start/end values into the dropdown list
        this.locations.update(list => {
          const merged = new Set(list);
          if (data.startPoint) merged.add(data.startPoint);
          if (data.endpoint)   merged.add(data.endpoint);
          return Array.from(merged).sort();
        });

        this.form.patchValue({
          type:       data.type,
          startPoint: data.startPoint,
          endpoint:   data.endpoint,
          status:     data.status,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load route.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.form.value.startPoint === this.form.value.endpoint) {
      this.error.set('Start and end points must be different.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    const payload = this.form.value;

    if (this.isEditMode()) {
      this.routeService.update(this.routeId(), payload as any).subscribe({
        next: () => {
          this.saving.set(false);
          this.notify.success('Route updated successfully.');
          this.router.navigate(['/transport/routes', this.routeId()]);
        },
        error: err => {
          this.saving.set(false);
          this.error.set(err.error?.errors?.[0] ?? 'Failed to save route.');
          this.notify.error('Failed to save route.');
        },
      });
    } else {
      this.routeService.create({
        ...payload as any,
        operatorID: this.auth.currentUser()?.id ?? '',
      }).subscribe({
        next: result => {
          this.saving.set(false);
          this.notify.success('Route created successfully.');
          const newId = (result as any).id ?? this.routeId();
          this.router.navigate(['/transport/routes', newId]);
        },
        error: err => {
          this.saving.set(false);
          this.error.set(err.error?.errors?.[0] ?? 'Failed to save route.');
          this.notify.error('Failed to save route.');
        },
      });
    }
  }

  goBack(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/transport/routes', this.routeId()]);
    } else {
      this.router.navigate(['/transport']);
    }
  }
}