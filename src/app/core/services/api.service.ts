import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export type ApiQueryParams = Record<string, string | number | boolean | undefined | null>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string, params?: ApiQueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(url, { params: this.buildParams(params) })
      .pipe(map(res => res.data as T));
  }

  post<T, B = unknown>(url: string, body: B): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(url, body)
      .pipe(map(res => res.data as T));
  }

  put<T, B = unknown>(url: string, body: B): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(url, body)
      .pipe(map(res => res.data as T));
  }

  patch<T, B = unknown>(url: string, body: B): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(url, body)
      .pipe(map(res => res.data as T));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(url)
      .pipe(map(res => res.data as T));
  }

  private buildParams(source?: ApiQueryParams): HttpParams {
    let params = new HttpParams();
    if (!source) return params;

    Object.entries(source).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}