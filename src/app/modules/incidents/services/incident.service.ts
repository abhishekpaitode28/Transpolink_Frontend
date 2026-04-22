import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Incident {
  id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  roadSegmentId: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Incident[]> {
    return this.api.get<Incident[]>('/api/incidents');
  }

  getById(id: string): Observable<Incident> {
    return this.api.get<Incident>(`/api/incidents/${id}`);
  }

  updateStatus(id: string, status: string): Observable<Incident> {
    return this.api.put<Incident>(`/api/incidents/${id}/status`, { status });
  }
}
