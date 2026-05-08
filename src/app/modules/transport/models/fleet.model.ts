// models/fleet.model.ts
export interface Fleet {
  id:          string;
  operatorID:  string;
  vehicleType: string;
  capacity:    number;
  status:      string;
  createdAt:   string;
}

export interface CreateFleetPayload {
  operatorID:  string;
  vehicleType: string;
  capacity:    number;
  status:      number;
}

export interface UpdateFleetPayload {
  vehicleType: string;
  capacity:    number;
  status:      number;
}