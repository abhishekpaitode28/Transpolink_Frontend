import { map, Observable } from "rxjs";
import { CreateResolutionPayload, Resolution } from "../models/resolution.model";
import { ApiResponse } from "../../../core/models/api-response.model";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ResolutionService {
  private http = inject(HttpClient);

  // Base URL pattern matches controller route:
  // api/incidents/{incidentId}/resolutions
  private base = `http://localhost:5000/api/incidents`;

  // POST /api/incidents/{incidentId}/resolutions
  create(incidentId: string, payload: CreateResolutionPayload): Observable<Resolution | null> {
    return this.http
      .post<ApiResponse<Resolution>>(
        `${this.base}/${incidentId}/resolutions`,  // ← fixed URL
        payload
      )
      .pipe(map(res => res.data));
  }

  // GET /api/incidents/{incidentId}/resolutions
  getByIncident(incidentId: string): Observable<Resolution[]> {
    return this.http
      .get<ApiResponse<Resolution[]>>(
        `${this.base}/${incidentId}/resolutions`   // ← fixed URL
      )
      .pipe(map(res => res.data ?? []));
  }
}