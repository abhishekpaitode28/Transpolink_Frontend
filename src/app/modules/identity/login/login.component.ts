import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// TODO: import signal, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import FormBuilder, Validators from '@angular/forms'
// TODO: import toSignal from '@angular/core/rxjs-interop'
// TODO: import Router from '@angular/router'
// TODO: import AuthService
// TODO: import map from 'rxjs'

@Component({
  selector: 'tl-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  // TODO: private fb     = inject(FormBuilder)
  // TODO: private auth   = inject(AuthService)
  // TODO: private router = inject(Router)

  // TODO: Build a reactive form group with two controls:
  //   email:    required + email validator
  //   password: required

  // TODO: formInvalid = toSignal(form.statusChanges.pipe(map(() => form.invalid)), ...)

  // TODO: loading = signal(false)
  // TODO: error   = signal('')

  submit(): void {
    // TODO: if form is invalid return early
    // TODO: set loading to true, clear error
    // TODO: destructure email and password from form.value
    // TODO: call auth.login(email, password).subscribe(...)
    //   next:  navigate to '/home'
    //   error: set error message, set loading to false
  }
}
