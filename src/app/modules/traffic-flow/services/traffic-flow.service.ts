import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService
// TODO: import TrafficFlow, CreateTrafficFlowRequest from models

@Injectable({ providedIn: 'root' })
export class TrafficFlowService {

  // TODO: private api = inject(ApiService)
  // TODO: private readonly path = '/api/traffic/flows'

  getAll(params?: Record<string, string>): Observable<any[]> {
    // TODO: return this.api.get<TrafficFlow[]>(this.path, params)
    return {} as any;
  }

  getBySegment(segmentId: string): Observable<any[]> {
    // TODO: return this.api.get<TrafficFlow[]>(this.path, { roadSegmentId: segmentId })
    return {} as any;
  }

  record(payload: any): Observable<any> {
    // TODO: return this.api.post<TrafficFlow>(this.path, payload)
    return {} as any;
  }
}
