import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrafficFlowService } from '../../services/traffic-flow.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'tl-traffic-flow-chart',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatDividerModule, ReactiveFormsModule],
  templateUrl: './traffic-flow-form.component.html',
  styleUrl: './traffic-flow-form.component.scss'
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
    date: [new Date().toISOString().slice(0, 16), Validators.required]
  });

  ngOnInit(): void {
    const segId = this.route.snapshot.queryParamMap.get('segmentId');
    if(segId){
      this.segmentId.set(segId);
      this.form.patchValue({ roadSegmentId: segId});
    }
  }

  onSubmit(): void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const raw = this.form.value;
    const payload = {
      roadSegmentId: raw.roadSegmentId,
      volume: raw.volume,
      speed: raw.speed,
      date: new Date(raw.date).toISOString()
    };

    this.flowService.recordFlow(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.notify.success("Traffic flow recorded successfully");

        if(this.segmentId()){
          this.router.navigate(['//traffic-flow/segment', this.segmentId()]);
        }else{
          this.router.navigate(['/traffic-flow/history']);
        }
      },
      error: () => {
        this.error.set('Failed to record Traffic flow. Please try again.');
        this.saving.set(false);
        this.notify.error('Failed to record traffic flow');
      },
    });
  }

  goBack() : void {
    this.segmentId() ? this.router.navigate(['/traffic-flow/segment', this.segmentId()]) : this.router.navigate(['/traffic-flow']);
  }
}