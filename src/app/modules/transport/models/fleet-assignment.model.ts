export interface FleetAssignment {
  id:            string;
  fleetID:       string;
  scheduleID:    string;
  vehicleType:   string;
  vehicleStatus: string;
  departureTime: string;
  routeName:     string;
  createdAt:     string;
}

export interface CreateAssignmentPayload {
  fleetID:    string;
  scheduleID: string;
}

export interface LiveFleet {
  assignmentId:     string;
  fleetID:          string;
  vehicleType:      string;
  routeName:        string;
  scheduledArrival: string;
  fleetStatus:      number;
  tripStatus:       number;
  isDelayed:        boolean;
}