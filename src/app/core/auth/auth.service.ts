import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// TODO: import signal, computed from '@angular/core'
// TODO: import environment from environments/environment
// TODO: import User model

// TODO: Define AuthResponse interface — shape of the login API response
// Fields: token (string), user (User)

@Injectable({ providedIn: 'root' })
export class AuthService {

  // TODO: Create a private signal to hold the JWT token
  //       Read initial value from localStorage using the key 'tl_token'

  // TODO: Create a private signal to hold the current User object

  // TODO: Create a computed signal 'isAuthenticated' — true when token exists

  // TODO: Expose currentUser as a readonly signal

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    // TODO: POST to `${environment.apiBaseUrl}/api/identity/login` with { email, password }
    // TODO: Use tap() to store the token in localStorage and update signals
    return {} as any;
  }

  logout(): void {
    // TODO: Remove token from localStorage
    // TODO: Reset both signals to null
    // TODO: Navigate to '/auth/login'
  }

  getToken(): string | null {
    // TODO: Return the current token value from the signal
    return null;
  }
}
