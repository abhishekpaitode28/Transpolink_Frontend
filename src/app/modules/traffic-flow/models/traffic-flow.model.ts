// TODO: import TrafficStatus enum

// TODO: Define TrafficFlow interface — matches PDF Section 4.3 TrafficFlow entity
// Fields: id, roadSegmentId, vehicleCount, averageSpeedKph,
//         congestionLevel (0–100), status (TrafficStatus), recordedAt
export interface TrafficFlow {
  // TODO: add fields
}

// TODO: Define CreateTrafficFlowRequest — fields sent when recording a new reading
// Fields: roadSegmentId, vehicleCount, averageSpeedKph, congestionLevel
export interface CreateTrafficFlowRequest {
  // TODO: add fields
}
