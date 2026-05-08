import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export type ApiQueryParams = {
  [key: string]: string | number | boolean | undefined;
};
@Injectable({ providedIn: 'root' })
export class ApiService {

  private http = inject(HttpClient);

  
  get<T>(url: string, params?:ApiQueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(url, { params: this.buildParams(params) })
      .pipe(map(res => res.data as T));
  }

  getList<T>(url: string, params?:ApiQueryParams): Observable<T[]> {
    return this.http
      .get<ApiResponse<T[]>>(url, { params: this.buildParams(params) })
      .pipe(map(res => res.data ?? []));
  }

  /** POST request — unwraps ApiResponse<T> to T */
  post<T, B = unknown>(url: string, body: B): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(url, body)
      .pipe(map(res => res.data as T));
  }

  /** PUT request — unwraps ApiResponse<T> to T */
  put<T, B = unknown>(url: string, body: B): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(url, body)
      .pipe(map(res => res.data as T));
  }

  /** DELETE request — unwraps ApiResponse<T> to T */
  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(url)
      .pipe(map(res => res.data as T));
  }

  /** Builds HttpParams from a plain object, skipping undefined / null / empty values */
  private buildParams(source?: ApiQueryParams): HttpParams {
    let params = new HttpParams();
    if (!source) return params;

    for (const [key, value] of Object.entries(source)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}