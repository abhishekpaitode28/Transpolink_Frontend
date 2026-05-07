import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  Schedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from '../models/schedule.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/schedule`;

  getAll(): Observable<Schedule[]> {
    return this.http
      .get<ApiResponse<Schedule[]>>(`${this.base}/get-schedules`)
      .pipe(map(res => res.data ?? []));
  }

  getByRoute(routeId: string): Observable<Schedule[]> {
    return this.http
      .get<ApiResponse<Schedule[]>>(`${this.base}/route/${routeId}`)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<Schedule> {
    return this.http
      .get<ApiResponse<Schedule>>(`${this.base}/getScheduleById/${id}`)
      .pipe(map(res => res.data!));
  }

  create(payload: CreateSchedulePayload): Observable<Schedule> {
    return this.http
      .post<ApiResponse<Schedule>>(`${this.base}/create-schedule`, payload)
      .pipe(map(res => res.data!));
  }

  update(id: string, payload: UpdateSchedulePayload): Observable<Schedule> {
    return this.http
      .put<ApiResponse<Schedule>>(`${this.base}/update-schedule/${id}`, payload)
      .pipe(map(res => res.data!));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/delete-schedule/${id}`)
      .pipe(map(res => res.data!));
  }
}