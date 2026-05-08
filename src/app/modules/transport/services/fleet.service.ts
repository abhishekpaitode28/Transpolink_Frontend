import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  Fleet,
  CreateFleetPayload,
  UpdateFleetPayload,
} from '../models/fleet.model';

@Injectable({ providedIn: 'root' })
export class FleetService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/fleet`;

  getAll(): Observable<Fleet[]> {
    return this.http
      .get<ApiResponse<Fleet[]>>(`${this.base}/get-fleet`)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<Fleet> {
    return this.http
      .get<ApiResponse<Fleet>>(`${this.base}/get-fleetById/${id}`)
      .pipe(map(res => res.data!));
  }

  create(payload: CreateFleetPayload): Observable<Fleet> {
    return this.http
      .post<ApiResponse<Fleet>>(`${this.base}/create-fleet`, payload)
      .pipe(map(res => res.data!));
  }

  update(id: string, payload: UpdateFleetPayload): Observable<boolean> {
    return this.http
      .put<ApiResponse<boolean>>(`${this.base}/update-fleet/${id}`, payload)
      .pipe(map(res => res.data!));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/delete-fleet/${id}`)
      .pipe(map(res => res.data!));
  }

  
  getAvailable(): Observable<Fleet[]> {
  return this.getAll().pipe(
    map(fleet => fleet.filter(f => f.status === 'Available'))
  );
}

}