import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';

// Services
import { DashboardService } from '../../services/dashboard.service';
import { AnalyticsService } from '../../services/analytics.service';
import { NotificationService } from '../../../../core/services/notification.service';

// Models
import {
  CityDashboard,
  CongestionHeatmapPoint,
  IncidentBreakdown,
  TrafficVolumeTrend,
} from '../../models/dashboard.model';
import { TrafficInsights } from '../../models/analytics.model';

// Components
import { StatCardComponent } from '../stat-card/stat-card.component';

/**
 * Main reporting dashboard.
 *
 * Smart "container" component:
 *   - Injects DashboardService and AnalyticsService
 *   - Fetches all dashboard widgets in parallel via forkJoin
 *   - Owns the loading state and error handling
 *   - Renders presentational components (StatCard) with the fetched data
 *
 * SRP: This component does NOT format data, NOT make HTTP calls directly,
 * NOT contain business logic. It just orchestrates services + renders.
 *
 * Default city: "Chennai" — chosen because the user is in Chennai (per system
 * context). Real production code would read this from user profile / settings,
 * but for this MVP we hardcode it. Easy to extract to a settings service later.
 */
@Component({
  selector: 'tl-reporting-dashboard',
  standalone: true,
  imports: [DatePipe, StatCardComponent,DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {


  private dashboardSvc = inject(DashboardService);
  private analyticsSvc = inject(AnalyticsService);
  private notify       = inject(NotificationService);
  private router       = inject(Router);


  readonly city = 'Chennai';

  loading        = signal(true);
  cityDashboard  = signal<CityDashboard | null>(null);
  trafficTrends  = signal<TrafficVolumeTrend[]>([]);
  heatmap        = signal<CongestionHeatmapPoint[]>([]);
  incidents      = signal<IncidentBreakdown[]>([]);
  insights       = signal<TrafficInsights | null>(null);


  mobilityVariant = computed<'success' | 'warning' | 'danger'>(() => {
    const status = this.cityDashboard()?.cityMobilityStatus;
    if (status === 'Critical')  return 'danger';
    if (status === 'Congested') return 'warning';
    return 'success';
  });


  totalTrafficVolume = computed(() =>
    this.trafficTrends().reduce((sum, t) => sum + t.volume, 0)
  );


  totalHotspots = computed(() => this.heatmap().length);


  totalIncidents = computed(() =>
    this.incidents().reduce((sum, i) => sum + i.count, 0)
  );


  ngOnInit(): void {
    this.loadDashboard();
  }


  refresh(): void {
    this.loading.set(true);
    this.loadDashboard();
  }


  goToReports(): void {
    this.router.navigate(['/reporting/reports']);
  }

  private loadDashboard(): void {
    forkJoin({
      city:     this.dashboardSvc.getCityDashboard(this.city),
      trends:   this.dashboardSvc.getTrafficVolumeTrends(),
      heatmap:  this.dashboardSvc.getCongestionHeatmap(),
      incidents:this.dashboardSvc.getIncidentBreakdown(),
      insights: this.analyticsSvc.getTrafficTrends(this.city, 7),
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: ({ city, trends, heatmap, incidents, insights }) => {
        this.cityDashboard.set(city);
        this.trafficTrends.set(trends);
        this.heatmap.set(heatmap);
        this.incidents.set(incidents);
        this.insights.set(insights);
      },
      error: () => {
        this.notify.error('Failed to load dashboard data. Please try again.');
      },
    });
  }
}