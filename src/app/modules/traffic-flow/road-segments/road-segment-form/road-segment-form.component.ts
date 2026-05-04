import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { RoadSegmentService } from '../../services/road-segment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { StatusType } from '../../models/traffic-status.enum';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';

@Component({
  selector: 'tl-road-segment-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './road-segment-form.component.html',
  styleUrl: './road-segment-form.component.scss'
})
export class RoadSegmentFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private segmentService = inject(RoadSegmentService);
  private notify = inject(NotificationService);

  isEditMode = signal(false);
  segmentId = signal('');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  readonly statusOptions = Object.values(StatusType);

  form: FormGroup = this.fb.group({
    location : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    length : [null, [Validators.required, Validators.min(0.1), Validators.max(999)]],
    status : [StatusType.Active, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.isEditMode.set(true);
      this.segmentId.set(id);
      this.loadSegment(id);
    }
  }

  loadSegment(id: string): void {
    this.loading.set(true);
    this.segmentService.getById(id).subscribe({
      next: seg => {
        this.form.patchValue({
          location: seg.location,
          length:   seg.length,
          status:   seg.status,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load segment data.');
        this.loading.set(false);
      },
    });
  }

  onSubmit():void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    const payload = this.form.value;

    const request$ = this.isEditMode() ? this.segmentService.update(this.segmentId(), payload) : this.segmentService.create(payload);

    request$.subscribe({
      next: result => {
        this.saving.set(false);
        if(this.isEditMode()){
          this.notify.success('Segment updated Successfully');
          this.router.navigate(['/traffic-flow/segment', this.segmentId()]);
        }else{
          this.notify.success('Segment created successfully')
          const newId = (result as any).id ?? this.segmentId();
          this.router.navigate(['/traffic-flow/segment', newId])
        }
      },
      error: () => {
        this.error.set('Failed to save segment. Please try again later.');
        this.saving.set(false);
        this.notify.error('Failed to save segment');
      }
    });
  }

  goBack(): void {
    this.isEditMode() ? this.router.navigate(['traffic-flow/segment', this.segmentId()]) : this.router.navigate(['/traffic-flow']);
  }


}