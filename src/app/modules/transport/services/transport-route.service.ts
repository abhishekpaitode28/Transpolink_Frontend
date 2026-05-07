import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  TransportRoute,
  CreateRoutePayload,
  UpdateRoutePayload,
} from '../models/transport-route.model';

@Injectable({ providedIn: 'root' })
export class TransportRouteService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/transportroute`;

  getAll(): Observable<TransportRoute[]> {
    return this.http
      .get<ApiResponse<TransportRoute[]>>(`${this.base}/get-routes`)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<TransportRoute> {
    return this.http
      .get<ApiResponse<TransportRoute>>(`${this.base}/get-routeById/${id}`)
      .pipe(map(res => res.data!));
  }

  create(payload: CreateRoutePayload): Observable<TransportRoute> {
    return this.http
      .post<ApiResponse<TransportRoute>>(`${this.base}/create-route`, payload)
      .pipe(map(res => res.data!));
  }

  update(id: string, payload: UpdateRoutePayload): Observable<TransportRoute> {
    return this.http
      .put<ApiResponse<TransportRoute>>(`${this.base}/update-route/${id}`, payload)
      .pipe(map(res => res.data!));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/delete-route/${id}`)
      .pipe(map(res => res.data!));
  }
}