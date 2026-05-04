import { StatusType } from "./traffic-status.enum";

export interface RoadSegment {
  id : string;
  location : string;
  length : number;
  status : StatusType
  hasActiveIncident : boolean;
}

export interface RoadSegmentPayload {
  location: string;
  length:   number;
  status:   StatusType;
}

export interface IncidentStatusUpdatePayload {
  roadSegmentId: string;
}