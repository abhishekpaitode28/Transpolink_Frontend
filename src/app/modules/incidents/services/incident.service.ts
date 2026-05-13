import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiResponse, PagedResult } from '../../../core/models/api-response.model';
import {
  CreateIncidentPayload,
  Incident,
  IncidentQuery,
  IncidentStatistics,
  UpdateIncidentPayload,
  UpdateIncidentStatusPayload
} from '../models/incident.model';

// Import RoadSegmentService to call resolveIncident when incident is resolved
import { RoadSegmentService } from '../../traffic-flow/services/road-segment.service';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http           = inject(HttpClient);
  private segmentService = inject(RoadSegmentService);
  private base           = `http://localhost:5000/api/incidents`;

  private buildParams(query: IncidentQuery = {}): HttpParams {
    let params = new HttpParams();
    if (query.page)     params = params.set('page',     String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));
    if (query.type)     params = params.set('type',     query.type);
    if (query.status)   params = params.set('status',   query.status);
    return params;
  }

  private emptyPage<T>(): PagedResult<T> {
    return { items: [], totalCount: 0, page: 1, pageSize: 10 };
  }

  getAll(query: IncidentQuery = {}): Observable<PagedResult<Incident>> {
    return this.http
      .get<ApiResponse<PagedResult<Incident>>>(this.base, { params: this.buildParams(query) })
      .pipe(map(res => res.data ?? this.emptyPage<Incident>()));
  }

  getMyReports(query: IncidentQuery = {}): Observable<PagedResult<Incident>> {
    return this.http
      .get<ApiResponse<PagedResult<Incident>>>(`${this.base}/my-reports`, {
        params: this.buildParams(query),
      })
      .pipe(map(res => res.data ?? this.emptyPage<Incident>()));
  }

  getById(id: string): Observable<Incident | null> {
    return this.http
      .get<ApiResponse<Incident>>(`${this.base}/${id}`)
      .pipe(map(res => res.data));
  }

  create(payload: CreateIncidentPayload): Observable<Incident | null> {
    return this.http
      .post<ApiResponse<Incident>>(this.base, payload)
      .pipe(map(res => res.data));
  }

  update(id: string, payload: UpdateIncidentPayload): Observable<Incident | null> {
    return this.http
      .put<ApiResponse<Incident>>(`${this.base}/${id}`, payload)
      .pipe(map(res => res.data));
  }

  // ── updateStatus — resolves HasActiveIncident on Traffic service ──────────
  // When status changes to 'Resolved' AND incident has a linked segment
  // → calls resolveIncident() on Traffic service
  // → sets HasActiveIncident = false on that road segment
  updateStatus(
    id: string,
    status: UpdateIncidentStatusPayload['status'],
    roadSegmentId?: string | null   // ← pass the incident's roadSegmentId
  ): Observable<Incident | null> {
    return this.http
      .patch<ApiResponse<Incident>>(
        `${this.base}/${id}/status`,
        { status } as UpdateIncidentStatusPayload
      )
      .pipe(
        map(res => res.data),
        tap(() => {
          // Status updated successfully
          // If resolved AND linked to a segment → clear the incident flag
          if (status === 'Resolved' && roadSegmentId) {
            this.segmentService.resolveIncident(roadSegmentId).subscribe({
              error: () => {} // silent — incident status already updated
            });
          }
        })
      );
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/${id}`)
      .pipe(map(res => res.data ?? false));
  }

  getStatistics(): Observable<IncidentStatistics | null> {
    return this.http
      .get<ApiResponse<IncidentStatistics>>(`${this.base}/statistics`)
      .pipe(map(res => res.data));
  }
}