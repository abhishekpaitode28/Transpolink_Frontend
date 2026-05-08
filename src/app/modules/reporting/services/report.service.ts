import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

import {
  GenerateReportRequest,
  GenerateReportResponse,
  ScheduleReportRequest,
  ScheduleReportResponse,
} from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {

private api=inject(ApiService);
private base=`${environment.apiBaseUrl}/api/reporting`;

/** generating report api */

generate(request:GenerateReportRequest):Observable<GenerateReportResponse>{
  return this.api.post<GenerateReportResponse>(`${this.base}/generate`,request);
}

/** getting reporting all over history */
getHistory():Observable<GenerateReportResponse[]>{
  return this.api.getList<GenerateReportResponse>(`${this.base}/history`);
}

/** get status of any report */
getStatus(reportId:string):Observable<GenerateReportResponse>{
  return this.api.get<GenerateReportResponse>(`${this.base}/${reportId}/status`);
}

/**post ing any schedule */

schedule(request:ScheduleReportRequest):Observable<ScheduleReportResponse>{
  return this.api.post<ScheduleReportResponse>(`${this.base}/schedule`,request);
}

}
