import { Injectable,inject } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../../../core/services/api.service";
import { environment } from "../../../../environments/environment";

import {
  CityDashboard,
  DashboardSummary,
  TrafficVolumeTrend,
  CongestionHeatmapPoint,
  IncidentBreakdown,
  TransportPerformance,
  ComplianceOverview,
} from '../models/dashboard.model';

import { ReportQueryParams } from "../models/report.model";


@Injectable({providedIn:'root'})
export class DashboardService{
    private base=`${environment.apiBaseUrl}/api/reporting/dashboard`;
    private api=inject(ApiService);


    getCityDashboard(city:string):Observable<CityDashboard>{
        return this.api.get<CityDashboard>(`${this.base}/${encodeURIComponent(city)}`)
    }

    getSummary(query?:ReportQueryParams):Observable<DashboardSummary>{
        return this.api.get<DashboardSummary>(`${this.base}/summary`,query);
    }
    getTrafficVolumeTrends(query?: ReportQueryParams): Observable<TrafficVolumeTrend[]> {
    return this.api.getList<TrafficVolumeTrend>(`${this.base}/traffic/trends`, query);
  }


  getCongestionHeatmap(query?: ReportQueryParams): Observable<CongestionHeatmapPoint[]> {
    return this.api.getList<CongestionHeatmapPoint>(`${this.base}/traffic/heatmap`, query);
  }


  getIncidentBreakdown(query?: ReportQueryParams): Observable<IncidentBreakdown[]> {
    return this.api.getList<IncidentBreakdown>(`${this.base}/incidents/breakdown`, query);
  }

 
  getTransportPerformance(query?: ReportQueryParams): Observable<TransportPerformance> {
    return this.api.get<TransportPerformance>(`${this.base}/transport/performance`, query);
  }

  
  getComplianceOverview(query?: ReportQueryParams): Observable<ComplianceOverview> {
    return this.api.get<ComplianceOverview>(`${this.base}/compliance/overview`, query);
  }

}