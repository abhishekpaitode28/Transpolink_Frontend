// TODO: import TrafficStatus enum

// TODO: Define RoadSegment interface — matches PDF Section 4.3 entity
// Fields: id, name, startPoint, endPoint, lengthKm, speedLimitKph, status (TrafficStatus), isActive, lastUpdated
export interface RoadSegment {
  // TODO: add fields
}

// TODO: Define CreateRoadSegmentRequest — fields sent when creating a new segment
// Fields: name, startPoint, endPoint, lengthKm, speedLimitKph
export interface CreateRoadSegmentRequest {
  // TODO: add fields
}

// TODO: Define UpdateRoadSegmentRequest — extends Create + adds isActive
export interface UpdateRoadSegmentRequest extends CreateRoadSegmentRequest {
  // TODO: isActive: boolean
}
