import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, JwtPayload } from '../auth/auth.models';

const TOKEN_KEY = 'tl_token';
// RegisterRequest, AuthResponse, JwtPayload 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private buildFakeToken(email: string, role: string): string {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: '1',
    email: email,
    name: email.split('@')[0],
    role: role,
    exp: Math.floor(Date.now() / 1000) + 86400  // 24 hours
  }));
  const signature = 'dummy';
  return `${header}.${payload}.${signature}`;
}

  // ── Private signal — source of truth ──────────────────────────────────────
  private _token = signal<string | null>(this.loadTokenFromStorage());

  // ── Public computed signals ────────────────────────────────────────────────
  readonly isLoggedIn = computed(() => {
    const token = this._token();
    if (!token) return false;
    // Check token hasn't expired
    const payload = this.decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  });

  readonly currentUser = computed(() => {
    const token = this._token();
    if (!token) return null;
    const payload = this.decodeToken(token);
    if (!payload) return null;

    const displayName = payload.name ?? payload.email.split('@')[0];
    const initials = displayName
      .split(' ')
      .map((p: string) => p.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return {
      email: payload.email,
      role: payload.role as any,
      displayName,
      initials,
    };
  });

  readonly currentRole = computed(() => this.currentUser()?.role ?? null);

  // ── Login 

  // login(payload: LoginRequest): Observable<AuthResponse> {
  //   return this.http
  //     .post<AuthResponse>(`${environment.apiBaseUrl}/api/Login`, payload)
  //     .pipe(
  //       tap(res => {
  //         localStorage.setItem(TOKEN_KEY, res.token);
  //         this._token.set(res.token);
  //       })
  //     );
  // }

  //_Dummy login
  login(payload: LoginRequest): Observable<AuthResponse> {
  // DUMMY LOGIN — remove when backend is ready
  const fakeToken = this.buildFakeToken(payload.email, 'Admin');
  localStorage.setItem(TOKEN_KEY, fakeToken);
  this._token.set(fakeToken);
  this.router.navigate(['/home']);
  return of({ token: fakeToken });
}

  // ── Register ───────────────────────────────────────────────────────────────
  // register(payload: RegisterRequest): Observable<any> {
  //   return this.http.post(`${environment.apiBaseUrl}/api/register`, payload);
  // }

  // -- Fake register
  register(payload: RegisterRequest): Observable<any> {
  return of({ success: true });
}

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  // ── Get raw token (used by interceptor) ───────────────────────────────────
  getToken(): string | null {
    return this._token();
  }

  // ── Private helpers ────────────────────────────────────────────────────────
  private loadTokenFromStorage(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      // JWT is three base64 parts split by '.'
      const base64Payload = token.split('.')[1];
      const decoded = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }
}