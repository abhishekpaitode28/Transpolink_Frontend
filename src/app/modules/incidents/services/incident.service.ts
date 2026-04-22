import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService from core/services/api.service

// TODO: Define the Incident interface — matches PDF Section 4.2
// Fields: id, title, type ('Accident'|'Breakdown'|'Roadblock'),
//         location, status ('Open'|'InProgress'|'Resolved'),
//         roadSegmentId, createdAt
export interface Incident {}

@Injectable({ providedIn: 'root' })
export class IncidentService {

  // TODO: private api = inject(ApiService)

  getAll(): Observable<Incident[]> {
    // TODO: return this.api.get<Incident[]>('/api/incidents')
    return {} as any;
  }

  getById(id: string): Observable<Incident> {
    // TODO: return this.api.get<Incident>(`/api/incidents/${id}`)
    return {} as any;
  }

  updateStatus(id: string, status: string): Observable<Incident> {
    // TODO: return this.api.put<Incident>(`/api/incidents/${id}/status`, { status })
    return {} as any;
  }
}
