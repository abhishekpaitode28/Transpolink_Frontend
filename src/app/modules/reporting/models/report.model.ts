import { ApiQueryParams } from "../../../core/services/api.service";


export type ReportScope = 'Incident' | 'Transport' | 'Traffic' | 'Compliance' | 'General';

export type ReportFrequency = 'Daily' | 'Weekly' | 'Monthly';

export type ReportFormat = 'PDF' | 'CSV' | 'JSON';

export type ReportStatus = 'Pending' | 'Generated' | 'Completed' | 'Failed';




export interface GenerateReportRequest {
  scope:     ReportScope;
  fromDate?: string;  
  toDate?:   string;
  format?:   ReportFormat;
}

export interface GenerateReportResponse {
  reportId:      string;
  scope:         string;
  status:        ReportStatus | string;
  generatedDate: string;
  downloadUrl?:  string;
}

export interface ScheduleReportRequest {
  scope:             ReportScope;
  frequency:         ReportFrequency;
  recipientUserId?:  string;
  format?:           ReportFormat;
}

export interface ScheduleReportResponse {
  scheduleId: string;
  scope:      string;
  frequency:  string;
  nextRunAt:  string;
  isActive:   boolean;
}

export interface ReportQueryParams extends ApiQueryParams{
  fromDate?: string;
  toDate?:   string;
  city?:     string;
}