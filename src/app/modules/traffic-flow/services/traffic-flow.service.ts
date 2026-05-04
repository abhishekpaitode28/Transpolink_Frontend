import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTrafficFlowPayload, TrafficFlow, TrafficFlowFilter } from '../models/traffic-flow.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TrafficFlowService {

  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/TrafficFlow`;

  getBySegment(segmentId:string, date?:string) : Observable<TrafficFlow[]> {
    let params = new HttpParams();
    if(date) params = params.set('date', date);

    return this.http.get<ApiResponse<TrafficFlow[]>>(`${this.base}/segment/${segmentId}`, {params}).pipe(map(res => res.data ?? []));
  }

  getLatest(segmentId : string) : Observable<TrafficFlow | null> {
    return this.http.get<ApiResponse<TrafficFlow>>(`${this.base}/segment/${segmentId}/latest`)
    .pipe(map(res => res.data));
  }

  getHistory(filter: TrafficFlowFilter) : Observable<TrafficFlow[]>{
    let params = new HttpParams();
    if(filter.roadSegmentId) params = params.set('roadsegmentId', filter.roadSegmentId);
    if(filter.date) params = params.set('date', filter.date);
    if(filter.startDate) params = params.set('startDate', filter.startDate);
    if(filter.endDate) params = params.set('endDate', filter.endDate);
    if(filter.status) params = params.set('status', filter.status);

    return this.http.get<ApiResponse<TrafficFlow[]>>(`${this.base}/history`, {params})
    .pipe(map(res => res.data ?? []));
  }

  recordFlow(payload: CreateTrafficFlowPayload) : Observable<string> {
    return this.http.post<ApiResponse<string>>(this.base, payload)
    .pipe(map(res => res.data ?? ''));
  }

}
