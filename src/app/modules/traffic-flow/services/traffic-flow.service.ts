import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { TrafficFlow, CreateTrafficFlowRequest } from '../models/traffic-flow.model';

@Injectable({ providedIn: 'root' })
export class TrafficFlowService {
  private readonly path = '/api/traffic/flows';

  constructor(private api: ApiService) {}

  getAll(params?: Record<string, string>): Observable<TrafficFlow[]> {
    return this.api.get<TrafficFlow[]>(this.path, params);
  }

  getBySegment(segmentId: string): Observable<TrafficFlow[]> {
    return this.api.get<TrafficFlow[]>(`${this.path}`, { roadSegmentId: segmentId });
  }

  record(payload: CreateTrafficFlowRequest): Observable<TrafficFlow> {
    return this.api.post<TrafficFlow>(this.path, payload);
  }
}
