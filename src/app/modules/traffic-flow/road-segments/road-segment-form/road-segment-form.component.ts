import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoadSegmentService } from '../../services/road-segment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { map } from 'rxjs';

@Component({
  selector: 'tl-road-segment-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './road-segment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadSegmentFormComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private segmentService = inject(RoadSegmentService);
  private notify         = inject(NotificationService);

  isEdit    = signal(false);
  segmentId = signal<string | null>(null);
  loading   = signal(false);

  form = this.fb.group({
    name:          ['', [Validators.required, Validators.minLength(3)]],
    startPoint:    ['', Validators.required],
    endPoint:      ['', Validators.required],
    lengthKm:      [0,  [Validators.required, Validators.min(0.1)]],
    speedLimitKph: [60, [Validators.required, Validators.min(10), Validators.max(200)]],
    isActive:      [true],
  });

  /** Reactive signal so [disabled] binding updates in zoneless mode. */
  formInvalid = toSignal(
    this.form.statusChanges.pipe(map(() => this.form.invalid)),
    { initialValue: this.form.invalid }
  );


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.segmentId.set(id);
      this.segmentService.getById(id).subscribe((seg) => this.form.patchValue(seg));
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const val = this.form.value as any;

    const req$ = this.isEdit()
      ? this.segmentService.update(this.segmentId()!, val)
      : this.segmentService.create(val);

    req$.subscribe({
      next: () => {
        this.notify.success(`Road segment ${this.isEdit() ? 'updated' : 'created'}.`);
        this.router.navigate(['/traffic-flow/road-segments']);
      },
      error: () => {
        this.notify.error('Failed to save road segment.');
        this.loading.set(false);
      },
    });
  }
}
