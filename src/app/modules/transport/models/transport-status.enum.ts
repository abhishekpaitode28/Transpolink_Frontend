// models/transport-status.enum.ts
export enum TransportRouteStatus {
  Active   = 'Active',
  Inactive = 'Inactive',
}

export enum FleetStatus {
  Available        = 'Available',
  InService        = 'InService',
  UnderMaintenance = 'UnderMaintenance',
}

export enum ScheduleStatus {
  OnTime    = 'OnTime',
  Delayed   = 'Delayed',
  Active    = 'Active',
  Inactive  = 'Inactive',
  Cancelled = 'Cancelled',
}

// Integer values matching backend StatusType enum
export const StatusTypeInt: Record<string, number> = {
  Active:           0,
  Inactive:         1,
  OnTime:           6,
  Delayed:          7,
  Available:        8,
  InService:        9,
  UnderMaintenance: 10,
};