import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('tl_token'));
  private _user = signal<User | null>(null);

  readonly isAuthenticated = computed(() => !!this._token());
  readonly currentUser = this._user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/identity/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('tl_token', res.token);
          this._token.set(res.token);
          this._user.set(res.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('tl_token');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
