import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import FormBuilder, Validators from '@angular/forms'
// TODO: import toSignal from '@angular/core/rxjs-interop'
// TODO: import ActivatedRoute, Router from '@angular/router'
// TODO: import RoadSegmentService
// TODO: import NotificationService
// TODO: import map from 'rxjs'

@Component({
  selector: 'tl-road-segment-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './road-segment-form.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadSegmentFormComponent implements OnInit {

  // TODO: private fb             = inject(FormBuilder)
  // TODO: private route          = inject(ActivatedRoute)
  // TODO: private router         = inject(Router)
  // TODO: private segmentService = inject(RoadSegmentService)
  // TODO: private notify         = inject(NotificationService)

  // TODO: isEdit    = signal(false)
  // TODO: segmentId = signal<string | null>(null)
  // TODO: loading   = signal(false)

  // TODO: Build a reactive form group with controls:
  //   name:          required, minLength(3)
  //   startPoint:    required
  //   endPoint:      required
  //   lengthKm:      required, min(0.1)
  //   speedLimitKph: required, min(10), max(200)
  //   isActive:      default true

  // TODO: formInvalid = toSignal(form.statusChanges.pipe(map(() => form.invalid)), ...)

  ngOnInit(): void {
    // TODO: check route param 'id' — if present set isEdit(true), segmentId(id)
    // TODO: call segmentService.getById(id) and patch the form with the returned data
  }

  submit(): void {
    // TODO: return early if form is invalid
    // TODO: set loading to true
    // TODO: cast form.value — call create() or update() based on isEdit()
    //   next:  show success toast, navigate to '/traffic-flow/road-segments'
    //   error: show error toast, set loading to false
  }
}
