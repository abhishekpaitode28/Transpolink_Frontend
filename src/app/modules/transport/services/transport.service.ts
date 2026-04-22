import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService

// TODO: Define TransportRoute interface — PDF Section 4.4
// Fields: id, operatorId, type ('Bus'|'Train'), startPoint, endPoint, status

// TODO: Define Schedule interface — PDF Section 4.4
// Fields: id, routeId, departureTime, arrivalTime, status

// TODO: Define Fleet interface — PDF Section 4.4
// Fields: id, operatorId, vehicleType, capacity, status

@Injectable({ providedIn: 'root' })
export class TransportService {

  // TODO: private api = inject(ApiService)

  getRoutes(): Observable<any[]> {
    // TODO: return this.api.get('/api/transport/routes')
    return {} as any;
  }

  getSchedules(): Observable<any[]> {
    // TODO: return this.api.get('/api/transport/schedules')
    return {} as any;
  }

  getFleet(): Observable<any[]> {
    // TODO: return this.api.get('/api/transport/fleet')
    return {} as any;
  }
}
