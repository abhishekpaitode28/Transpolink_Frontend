import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

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

interface ApiResponse<T> { success?: boolean; data?: T; value?: T; message?: string; }

@Injectable({ providedIn: 'root' })
export class ComplianceService {

  private api = inject(ApiService);

  // ── Audits ────────────────────────────────────────────────────────────────

  getAudits(): Observable<Audit[]> {
    return this.api.get<any>('/api/audits').pipe(
      map((res) => {
        if (Array.isArray(res))        return res as Audit[];
        if (Array.isArray(res?.value)) return res.value as Audit[];
        if (Array.isArray(res?.data))  return res.data as Audit[];
        return [] as Audit[];
      })
    );
  }

  getAuditById(id: string): Observable<Audit> {
    return this.api.get<any>(`/api/audits/${id}`).pipe(
      map((res) => res?.data ?? res?.value ?? res as Audit)
    );
  }

  createAudit(request: CreateAuditRequest): Observable<Audit> {
    return this.api.post<any>('/api/audits', request).pipe(
      map((res) => res?.data ?? res?.value ?? res as Audit)
    );
  }

  updateAudit(id: string, request: UpdateAuditRequest): Observable<Audit> {
    return this.api.put<any>(`/api/audits/${id}`, request).pipe(
      map((res) => res?.data ?? res?.value ?? res as Audit)
    );
  }

  deleteAudit(id: string): Observable<void> {
    return this.api.delete<void>(`/api/audits/${id}`);
  }

  // ── Compliance Records ────────────────────────────────────────────────────

  getRecordsByAudit(auditId: string): Observable<ComplianceRecord[]> {
    return this.api.get<any>(`/api/compliance-records/audit/${auditId}`).pipe(
      map((res) => {
        if (Array.isArray(res))        return res as ComplianceRecord[];
        if (Array.isArray(res?.value)) return res.value as ComplianceRecord[];
        if (Array.isArray(res?.data))  return res.data as ComplianceRecord[];
        return [] as ComplianceRecord[];
      })
    );
  }

  createRecord(request: CreateRecordRequest): Observable<ComplianceRecord> {
    return this.api.post<any>('/api/compliance-records', request).pipe(
      map((res) => res?.data ?? res?.value ?? res as ComplianceRecord)
    );
  }

  deleteRecord(id: string): Observable<void> {
    return this.api.delete<void>(`/api/compliance-records/${id}`);
  }
}