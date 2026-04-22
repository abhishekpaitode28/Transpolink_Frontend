import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService

// TODO: Define Report interface — PDF Section 4.6
// Fields: id, scope ('Incident'|'Transport'|'Traffic'), metrics (object or string), generatedDate

@Injectable({ providedIn: 'root' })
export class ReportingService {

  // TODO: private api = inject(ApiService)

  getReports(): Observable<any[]> {
    // TODO: return this.api.get('/api/reports')
    return {} as any;
  }

  generate(scope: string): Observable<any> {
    // TODO: return this.api.post('/api/reports/generate', { scope })
    return {} as any;
  }
}
