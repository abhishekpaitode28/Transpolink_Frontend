// models/transport-route.model.ts
import { TransportRouteStatus } from './transport-status.enum';
import { Schedule } from './schedule.model';

export interface TransportRoute {
  id:         string;
  operatorID: string;
  type:       string;
  startPoint: string;
  endpoint:   string;
  status:     number;
  schedules?: Schedule[];
  routeNumber:string;
}

export interface CreateRoutePayload {
  operatorID: string;
  routeNumber:string;
  type:       string;
  startPoint: string;
  endpoint:   string;
  status:     number;
}

export interface UpdateRoutePayload {
  type:       string;
  routeNumber:string;
  startPoint: string;
  endpoint:   string;
  status:     number;
}