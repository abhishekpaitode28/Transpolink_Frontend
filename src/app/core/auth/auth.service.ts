import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id:           string;
  fullName:     string;
  displayName?: string;
  initials?:    string;
  email:        string;
  role:         string;
  phone?:       string;
  isActive?:    boolean;
}

export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  expiresAt:    string;
  user:         User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'tl_token';

  private _token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );
  private _user = signal<User | null>(
    this.getUserFromToken(localStorage.getItem(this.TOKEN_KEY))
  );

  isAuthenticated = computed(() => !!this._token());
  isLoggedIn      = computed(() => !!this._token());
  currentUser     = this._user.asReadonly();
  currentRole     = computed(() => this._user()?.role as any ?? null);
  initials        = computed(() => this._user()?.initials    ?? '');
  displayName     = computed(() => this._user()?.displayName ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromToken(token: string | null): User | null {
    if (!token) return null;
    try {
      const payload  = JSON.parse(atob(token.split('.')[1]));
      const fullName = payload.name ?? '';
      const initials = fullName
        .split(' ')
        .map((p: string) => p.charAt(0))
        .slice(0, 2)
        .join('');
      return {
        id:          payload.userId ?? payload.sub ?? '',
        fullName,
        displayName: fullName,
        initials,
        email:       Array.isArray(payload.email) ? payload.email[0] : (payload.email ?? ''),
        role:        payload.role ?? '',
      };
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; data: AuthResponse }> {
    return this.http
      .post<{ success: boolean; data: AuthResponse }>(
        `${environment.apiBaseUrl}/api/auth/Login`,
        { email, password }
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
            this._token.set(res.data.accessToken);
            const user     = res.data.user;
            const initials = (user.fullName ?? '')
              .split(' ')
              .map((p: string) => p.charAt(0))
              .slice(0, 2)
              .join('');
            this._user.set({ ...user, displayName: user.fullName, initials });
          }
        })
      );
  }

  register(payload: {
    fullName: string; email: string; password: string; phone: string; role: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/auth/Register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}