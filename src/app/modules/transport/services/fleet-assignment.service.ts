import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  FleetAssignment,
  CreateAssignmentPayload,
  LiveFleet,
} from '../models/fleet-assignment.model';

@Injectable({ providedIn: 'root' })
export class FleetAssignmentService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/FleetAssignment`;

  getAll(): Observable<FleetAssignment[]> {
    return this.http
      .get<ApiResponse<FleetAssignment[]>>(`${this.base}/get-all-assignments`)
      .pipe(map(res => res.data ?? []));
  }

  assign(payload: CreateAssignmentPayload): Observable<FleetAssignment> {
    return this.http
      .post<ApiResponse<FleetAssignment>>(`${this.base}/create-assignment`, payload)
      .pipe(map(res => res.data!));
  }

  remove(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/delete-assignment/${id}`)
      .pipe(map(res => res.data!));
  }

  getBySchedule(scheduleId: string): Observable<FleetAssignment[]> {
    return this.http
      .get<ApiResponse<FleetAssignment[]>>(`${this.base}/get-assignmentByScheduleId/${scheduleId}`)
      .pipe(map(res => res.data ?? []));
  }

  getByFleet(fleetId: string): Observable<FleetAssignment[]> {
    return this.http
      .get<ApiResponse<FleetAssignment[]>>(`${this.base}/get-assignmentByfleetId/${fleetId}`)
      .pipe(map(res => res.data ?? []));
  }

  startTrip(id: string): Observable<boolean> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.base}/start-trip/${id}`, {})
      .pipe(map(res => res.data!));
  }

  completeTrip(id: string): Observable<boolean> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.base}/complete-trip/${id}`, {})
      .pipe(map(res => res.data!));
  }

  reportDelay(id: string, minutes: number): Observable<boolean> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.base}/delay/${minutes}/${id}`, {})
      .pipe(map(res => res.data!));
  }

  getLiveDashboard(): Observable<LiveFleet[]> {
    return this.http
      .get<ApiResponse<LiveFleet[]>>(`${this.base}/live-dashboard`)
      .pipe(map(res => res.data ?? []));
  }
}
