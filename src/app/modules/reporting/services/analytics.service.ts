import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

import {
  TrafficInsights,
  PerformanceAnalysis,
} from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private api  = inject(ApiService);
  private base = `${environment.apiBaseUrl}/api/reporting/analytics`;

  /** GET /analytics/traffic-trends/{city}?days={n} */
  getTrafficTrends(city: string, days: number = 7): Observable<TrafficInsights> {
    return this.api.get<TrafficInsights>(
      `${this.base}/traffic-trends/${encodeURIComponent(city)}`,
      { days }
    );
  }

  /** GET /analytics/hotspots/{city} */
  getHotspots(city: string): Observable<PerformanceAnalysis> {
    return this.api.get<PerformanceAnalysis>(
      `${this.base}/hotspots/${encodeURIComponent(city)}`
    );
  }
}