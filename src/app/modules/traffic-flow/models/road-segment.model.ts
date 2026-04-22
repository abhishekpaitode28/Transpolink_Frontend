import { TrafficStatus } from './traffic-status.enum';

export interface RoadSegment {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  lengthKm: number;
  speedLimitKph: number;
  status: TrafficStatus;
  isActive: boolean;
  lastUpdated: string;
}

export interface CreateRoadSegmentRequest {
  name: string;
  startPoint: string;
  endPoint: string;
  lengthKm: number;
  speedLimitKph: number;
}

export interface UpdateRoadSegmentRequest extends CreateRoadSegmentRequest {
  isActive: boolean;
}
