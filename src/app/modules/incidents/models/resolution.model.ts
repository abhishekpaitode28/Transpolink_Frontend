export type ResolutionStatus = 'Pending' | 'Completed' | 'Rejected';

export interface Resolution {
  id:         string;
  incidentId: string;
  officerId:  string;
  actions:    string;
  date:       string;
  status:     ResolutionStatus;
  createdAt:  string;
  updatedAt:  string;
}

// Matches CreateResolutionDto — only two fields needed
export interface CreateResolutionPayload {
  actions: string;
  date:    string;  // ISO string
}