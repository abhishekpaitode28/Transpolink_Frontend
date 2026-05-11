export type IncidentType = 'Accident' | 'Breakdown' | 'Roadblock';
export type IncidentStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed' | 'Cancelled';

export interface Incident {
  id: string;
  reporterId: string;
  roadSegmentId: string | null;
  type: IncidentType;
  location: string;
  date: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentPayload {
  type: IncidentType;
  roadSegmentId?: string | null;
  location: string;
  date: string;
}

export interface UpdateIncidentPayload {
  type: IncidentType;
  location: string;
  date: string;
}

export interface UpdateIncidentStatusPayload {
  status: IncidentStatus;
}

export interface IncidentTypeCount {
  type: string;
  count: number;
}

export interface IncidentStatusCount {
  status: string;
  count: number;
}

export interface IncidentStatistics {
  totalIncidents: number;
  byType: IncidentTypeCount[];
  byStatus: IncidentStatusCount[];
}

export interface IncidentQuery {
  page?: number;
  pageSize?: number;
  type?: IncidentType | '';
  status?: IncidentStatus | '';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}