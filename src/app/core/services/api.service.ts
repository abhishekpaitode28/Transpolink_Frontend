import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: import HttpParams from '@angular/common/http'
// TODO: import catchError, throwError from 'rxjs/operators'
// TODO: import environment from environments/environment

@Injectable({ providedIn: 'root' })
export class ApiService {

  // TODO: declare a private readonly 'base' string from environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    // TODO: build HttpParams if params are provided
    // TODO: call this.http.get<T>(`${this.base}${path}`, { params })
    // TODO: pipe through catchError using handleError
    return {} as any;
  }

  post<T>(path: string, body: unknown): Observable<T> {
    // TODO: call this.http.post<T>(`${this.base}${path}`, body)
    // TODO: pipe through catchError
    return {} as any;
  }

  put<T>(path: string, body: unknown): Observable<T> {
    // TODO: call this.http.put<T>(...)
    return {} as any;
  }

  delete<T>(path: string): Observable<T> {
    // TODO: call this.http.delete<T>(...)
    return {} as any;
  }

  private handleError(error: unknown) {
    // TODO: console.error the error
    // TODO: return throwError(() => error)
  }
}
