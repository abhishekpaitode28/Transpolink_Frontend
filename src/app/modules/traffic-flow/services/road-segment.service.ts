import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  RoadSegment,
  CreateRoadSegmentRequest,
  UpdateRoadSegmentRequest,
} from '../models/road-segment.model';

@Injectable({ providedIn: 'root' })
export class RoadSegmentService {
  private readonly path = '/api/traffic/road-segments';

  constructor(private api: ApiService) {}

  getAll(): Observable<RoadSegment[]> {
    return this.api.get<RoadSegment[]>(this.path);
  }

  getById(id: string): Observable<RoadSegment> {
    return this.api.get<RoadSegment>(`${this.path}/${id}`);
  }

  create(payload: CreateRoadSegmentRequest): Observable<RoadSegment> {
    return this.api.post<RoadSegment>(this.path, payload);
  }

  update(id: string, payload: UpdateRoadSegmentRequest): Observable<RoadSegment> {
    return this.api.put<RoadSegment>(`${this.path}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }
}
