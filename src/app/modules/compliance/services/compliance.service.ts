import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ComplianceRecord {
  id: string; entityId: string; type: string; result: string; notes: string;
  incidentType: string; incidentLocation: string; incidentStatus: string;
  routeType: string; routeStartPoint: string; routeEndPoint: string; routeStatus: string;
}

export interface Audit {
  id: string; officerId: string; officerName: string; officerRole: string;
  scope: string; findings: string | null; status: string; auditDate: string;
  records: ComplianceRecord[];
}

export interface CreateAuditRequest { officerId: string; scope: string; status: number; }
export interface UpdateAuditRequest { findings: string; status: number; }
export interface CreateRecordRequest {
  auditId: string; entityId: string; type: string; result: string; notes: string;
}

@Injectable({ providedIn: 'root' })
export class ComplianceService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // ── Helper: extract array from any response shape ─────────────────────────
  private toArray<T>(res: any): T[] {
    if (Array.isArray(res))        return res as T[];
    if (Array.isArray(res?.value)) return res.value as T[];
    if (Array.isArray(res?.data))  return res.data as T[];
    return [] as T[];
  }

  // ── Helper: extract single item from any response shape ───────────────────
  private toItem<T>(res: any): T {
    return (res?.data ?? res?.value ?? res) as T;
  }

  // ── Audits ────────────────────────────────────────────────────────────────

  getAudits(): Observable<Audit[]> {
    return this.http
      .get<any>(`${this.base}/api/audits`)
      .pipe(map(res => this.toArray<Audit>(res)));
  }

  getAuditById(id: string): Observable<Audit> {
    return this.http
      .get<any>(`${this.base}/api/audits/${id}`)
      .pipe(map(res => this.toItem<Audit>(res)));
  }

  createAudit(request: CreateAuditRequest): Observable<Audit> {
    return this.http
      .post<any>(`${this.base}/api/audits`, request)
      .pipe(map(res => this.toItem<Audit>(res)));
  }

  updateAudit(id: string, request: UpdateAuditRequest): Observable<Audit> {
    return this.http
      .put<any>(`${this.base}/api/audits/${id}`, request)
      .pipe(map(res => this.toItem<Audit>(res)));
  }

  deleteAudit(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/api/audits/${id}`);
  }

  // ── Compliance Records ────────────────────────────────────────────────────

  getRecordsByAudit(auditId: string): Observable<ComplianceRecord[]> {
    return this.http
      .get<any>(`${this.base}/api/compliance-records/audit/${auditId}`)
      .pipe(map(res => this.toArray<ComplianceRecord>(res)));
  }

  createRecord(request: CreateRecordRequest): Observable<ComplianceRecord> {
    return this.http
      .post<any>(`${this.base}/api/compliance-records`, request)
      .pipe(map(res => this.toItem<ComplianceRecord>(res)));
  }

  deleteRecord(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/api/compliance-records/${id}`);
  }
}