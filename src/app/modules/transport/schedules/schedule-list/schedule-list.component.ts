import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe, SlicePipe, UpperCasePipe } from "@angular/common";
import { forkJoin } from "rxjs";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ScheduleService } from "../../services/schedule.service";
import { TransportRouteService } from "../../services/transport-route.service";
import { AuthService } from "../../../identity/auth/auth.service";
import { NotificationService } from "../../../../core/services/notification.service";

@Component({
  selector: "tl-schedule-list",
  standalone: true,
  imports: [
    DatePipe,
    SlicePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    UpperCasePipe
  ],
  templateUrl: "./schedule-list.component.html",
styles: [
  `
.tl-segment-table {
  /* Gives enough room so the Badge and Name stay on one line */
  .mat-column-transportID {
    flex: 0 0 400px; 
    padding-right: 16px !important;
  }

  .service-code-badge {
    font-family: 'SFMono-Regular', Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 700;
    color: #7c3aed; /* Purple for Routes */
    background-color: rgba(124, 58, 237, 0.08); 
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(124, 58, 237, 0.2);
    display: inline-block;
    white-space: nowrap;
    margin-right: 12px; /* Gap between badge and name */
  }
}

mat-header-cell {
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

  /* Header styling to match Fleet/Assignments */
  mat-header-cell {
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  `
]
})
export class ScheduleListComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private routeService = inject(TransportRouteService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  schedules = signal<any[]>([]);
  routeMap = new Map<string, string>(); // Key: ID, Value: "Start to End"
  loading = signal(false);
  error = signal("");

  readonly canEdit = computed(() =>
    ["Admin", "TransportOperator"].includes(this.auth.currentRole() ?? ""),
  );
  readonly displayedColumns = [
    "transportID",
    "departureTime",
    "arrivalTime",
    "status",
    "actions",
  ];

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
  this.loading.set(true);
  
  forkJoin({
    schedules: this.scheduleService.getAll(),
    routes:    this.routeService.getAll()
  }).subscribe({
    next: ({ schedules, routes }) => {
      // Build the map: now including the RT-XXXX code in the name
      routes.forEach((r: any) => {
        const serviceCode = `RT-${r.id.slice(0, 4).toUpperCase()}`;
        this.routeMap.set(r.id, `${serviceCode} (${r.startPoint} to ${r.endpoint})`);
      });
      
      this.schedules.set(schedules);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Failed to load data.');
      this.loading.set(false);
    },
  });
}

  getRouteName(id: string): string {
    return this.routeMap.get(id) ?? "Unknown Route";
  }

  createNew(): void {
    this.router.navigate(["/transport/schedules/new"]);
  }

  editSchedule(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(["/transport/schedules", id, "edit"]);
  }

  deleteSchedule(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm("Delete this schedule?")) return;
    this.scheduleService.delete(id).subscribe({
      next: () => {
        this.notify.success("Schedule deleted.");
        this.loadData();
      },
      error: () => this.notify.error("Failed to delete."),
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      OnTime: "tl-badge tl-badge--open",
      Delayed: "tl-badge tl-badge--incident",
      Active: "tl-badge tl-badge--free",
      Inactive: "tl-badge tl-badge--closed",
    };
    return map[status] ?? "tl-badge";
  }
}
