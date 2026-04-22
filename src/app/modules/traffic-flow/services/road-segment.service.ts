import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService
// TODO: import RoadSegment, CreateRoadSegmentRequest, UpdateRoadSegmentRequest from models

@Injectable({ providedIn: 'root' })
export class RoadSegmentService {

  // TODO: private api = inject(ApiService)
  // TODO: private readonly path = '/api/traffic/road-segments'

  getAll(): Observable<any[]> {
    // TODO: return this.api.get<RoadSegment[]>(this.path)
    return {} as any;
  }

  getById(id: string): Observable<any> {
    // TODO: return this.api.get<RoadSegment>(`${this.path}/${id}`)
    return {} as any;
  }

  create(payload: any): Observable<any> {
    // TODO: return this.api.post<RoadSegment>(this.path, payload)
    return {} as any;
  }

  update(id: string, payload: any): Observable<any> {
    // TODO: return this.api.put<RoadSegment>(`${this.path}/${id}`, payload)
    return {} as any;
  }

  delete(id: string): Observable<void> {
    // TODO: return this.api.delete<void>(`${this.path}/${id}`)
    return {} as any;
  }
}
