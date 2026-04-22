import { TrafficStatus } from './traffic-status.enum';

export interface TrafficFlow {
  id: string;
  roadSegmentId: string;
  vehicleCount: number;
  averageSpeedKph: number;
  congestionLevel: number;   // 0-100
  status: TrafficStatus;
  recordedAt: string;
}

export interface CreateTrafficFlowRequest {
  roadSegmentId: string;
  vehicleCount: number;
  averageSpeedKph: number;
  congestionLevel: number;
}
