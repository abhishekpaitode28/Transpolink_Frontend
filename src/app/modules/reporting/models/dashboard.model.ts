

export type MobilityStatus = 'Stable' | 'Congested' | 'Critical';




export interface CityDashboard {
  
  city:                  string;
  lastUpdated:           string;
  cityMobilityStatus:    MobilityStatus | string;

  
  congestionIndex:       number;   

 
  totalActiveIncidents:  number;
  activeIncidentsCount:  number;   


  onTimePerformance:     number;  
  systemPunctualityRate: number;  


  complianceRate:        number;   


  activeOfficersOnField: number;
  topPerformingOfficer:  string;


  alertsSentToday:       number;
}



export interface DashboardSummary {
  totalIncidents:   number;
  activeCongestion: number;
}


export interface TrafficVolumeTrend {
  date:   string;
  volume: number;
}


export interface CongestionHeatmapPoint {
  location:  string;
  intensity: number;   
}


export interface IncidentBreakdown {
  type:  string;
  count: number;
}


export interface TransportPerformance {
  onTimeRate: number;   
}


export interface ComplianceOverview {
  totalAudits:    number;
  complianceRate: number;  
}