import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  UserInfo,
  JwtPayload,
} from './auth.models';

// Storage keys 
const ACCESS_TOKEN_KEY  = 'tl_access_token';
const REFRESH_TOKEN_KEY = 'tl_refresh_token';
const USER_KEY          = 'tl_user';

// Identity service base URL 
const IDENTITY_URL = 'http://localhost:5001';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  // Private signals 
  private _token = signal<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  private _user = signal<UserInfo | null>(
    this.loadUserFromStorage()
  );

  // Public readonly signals 
  readonly currentUser = this._user.asReadonly();

  // isLoggedIn checks token exists AND is not expired
  readonly isLoggedIn = computed(() => {
    const token = this._token();
    if (!token) return false;
    const payload = this.decodeToken(token);
    if (!payload) return false;
    // exp is in seconds — multiply by 1000 for ms
    return payload.exp * 1000 > Date.now();
  });

  // currentRole — read from user object first, fallback to JWT decode
  readonly currentRole = computed((): string | null => {
    const user = this._user();
    if (user?.role) return user.role;
    const token = this._token();
    if (!token) return null;
    return this.decodeToken(token)?.role ?? null;
  });

  // displayName for sidebar — fullName or email prefix
  readonly displayName = computed(() => {
    const user = this._user();
    if (!user) return '';
    return user.fullName || user.email.split('@')[0];
  });

  // initials for avatar circle
  readonly initials = computed(() => {
    const name = this.displayName();
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  // Login 
  // POST http://localhost:5001/api/Auth/Login
  // Body:n{ email, password }
  // Response: ApiResponse<AuthResponseDto>
  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${IDENTITY_URL}/api/Auth/Login`,
        payload
      )
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.storeSession(res.data);
          }
        })
      );
  }

  // Register 
  // POST http://localhost:5001/api/Auth/register
  // Body: { fullName, email, password, phoneNumber }
  // Role is NOT sent — backend assigns Citizen automatically
  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${IDENTITY_URL}/api/Auth/register`,
        payload
      )
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.storeSession(res.data);
          }
        })
      );
  }

  // Refresh token 
  // POST http://localhost:5001/api/Auth/refresh
  // Body: { refreshToken }
  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${IDENTITY_URL}/api/Auth/refresh`,
        { refreshToken } as RefreshTokenRequest
      )
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.storeSession(res.data);
          }
        })
      );
  }

  // Logout 
  // POST http://localhost:5001/api/Auth/logout
  // Body: { refreshToken }
  // Requires Authorization header
  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      this.http
        .post(`${IDENTITY_URL}/api/Auth/logout`,
          { refreshToken } as RefreshTokenRequest
        )
        .subscribe({ error: () => {} }); 
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  // Get access token  
  getToken(): string | null {
    return this._token();
  }

  // Private: store session after login / register / refresh 
  private storeSession(data: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY,  data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY,          JSON.stringify(data.user));
    this._token.set(data.accessToken);
    this._user.set(data.user);
  }

  // Private: clear session on logout 
  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  // Private: load user from localStorage on app start 
  private loadUserFromStorage(): UserInfo | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserInfo) : null;
    } catch {
      return null;
    }
  }

  // Private: decode JWT payload 
  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64 = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}