export interface TrafficFlow{
  id : string;
  roadSegmentId : string;
  volume : number;
  speed : number;
  observationDate : string;
  status : string;
  isIncidentTriggered : boolean;
}

export interface CreateTrafficFlowPayload {
  roadSegmentId : string;
  volume : number;
  speed : number;
  date : string;
}

export interface TrafficFlowFilter{
  roadSegmentId? : string,
  date? : string,
  startDate? : string;
  endDate? : string;
  status?: string;
}