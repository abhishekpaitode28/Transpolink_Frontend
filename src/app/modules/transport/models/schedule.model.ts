// models/schedule.model.ts
export interface Schedule {
  id:            string;
  transportID:   string;
  departureTime: string;
  arrivalTime:   string;
  status:        string;
}

export interface CreateSchedulePayload {
  transportID:   string;
  departureTime: string;
  arrivalTime:   string;
  status:        number;
}

export interface UpdateSchedulePayload {
  transportID:   string;
  departureTime: string;
  arrivalTime:   string;
  status:        number;
}