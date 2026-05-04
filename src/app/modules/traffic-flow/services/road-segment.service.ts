import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IncidentStatusUpdatePayload, RoadSegment, RoadSegmentPayload } from '../models/road-segment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class RoadSegmentService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/RoadSegment`;
  private incidentBase = `${environment.apiBaseUrl}/api/TrafficIncident`
  

  // return this.api.get<RoadSegment[]>(this.path)
  getAll(): Observable<RoadSegment[]> {
    return this.http
    .get<ApiResponse<RoadSegment[]>>(this.base)
    .pipe(map(res => res.data ?? []))
  }

  // return this.api.get<RoadSegment>(`${this.path}/${id}`)
  getById(id: string): Observable<RoadSegmentPayload> {
    return this.http
    .get<ApiResponse<RoadSegmentPayload>>(`${this.base}/${id}`)
    .pipe(map(res => res.data!));
  }

  create(payload: RoadSegmentPayload): Observable<RoadSegment> {
    return this.http.post<ApiResponse<RoadSegment>>(this.base, payload).pipe(map(res => res.data!));
  }

  update(id: string, payload: RoadSegmentPayload): Observable<RoadSegmentPayload> {
    return this.http
    .put<ApiResponse<RoadSegmentPayload>>(`${this.base}/${id}`, payload)
    .pipe(map(res=>res.data!));
  }

  notifyIncident(roadSegmentId: string) : Observable<any> {
    return this.http.post(`${this.incidentBase}/notify-incident`, 
      {roadSegmentId} as IncidentStatusUpdatePayload
    );
  }

  resolveIncident(roadSegmentId:string):Observable<any>{
    return this.http.post(`${this.incidentBase}/resolve-incident`, {roadSegmentId} as IncidentStatusUpdatePayload)
  }
  
}
