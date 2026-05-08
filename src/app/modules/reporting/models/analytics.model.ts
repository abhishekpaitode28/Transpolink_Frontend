/**
 * Analytics-related DTOs.
 *
 * These mirror the C# DTOs in:
 *   TranspoLink.Modules.Reporting/Application/DTOs/ReportDto.cs
 *
 * Returned by:
 *   GET /api/reporting/analytics/traffic-trends/{city}?days={n}
 *   GET /api/reporting/analytics/hotspots/{city}
 *
 * Pure type definitions only — no logic.
 * Follows SRP: only analytics-shaped data lives here.
 */


// GET /analytics/traffic-trends/{city}?days={n}
export interface TrafficInsights {
  avgSpeed:  number;
  peakHours: string;
}


// GET /analytics/hotspots/{city}
export interface PerformanceAnalysis {
  metricName: string;    // e.g. "Active incident hotspots"
  value:      number;
}