import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe, UpperCasePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { FleetAssignmentService } from "../../services/fleet-assignment.service";
import { AuthService } from "../../../identity/auth/auth.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { FleetAssignment } from "../../models/fleet-assignment.model";
import { FleetService } from "../../services/fleet.service";
import { StatusTypeInt } from "../../models/transport-status.enum";
import { MatDivider } from "@angular/material/divider";
import { ScheduleService } from "../../services/schedule.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "tl-assignment-list",
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    UpperCasePipe,
    MatDivider,
  ],
  templateUrl: "./assignment-list.component.html",
  styles: [
    `
      .tl-segment-table {
        .mat-column-fleetCode,
        .mat-column-routeCode {
          flex: 0 0 110px;
        }

        .fleet-code-badge,
        .service-code-badge {
          font-family: "SFMono-Regular", Consolas, monospace;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          white-space: nowrap;
        }

        .fleet-code-badge {
          color: #2563eb;
          background-color: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
        }

        .service-code-badge {
          color: #7c3aed;
          background-color: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
      }

      mat-header-cell {
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        font-size: 0.75rem;
      }
    `,
  ],
})
export class AssignmentListComponent implements OnInit {
  private assignmentService = inject(FleetAssignmentService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private fleetService = inject(FleetService);
  private scheduleService = inject(ScheduleService);

  assignments = signal<FleetAssignment[]>([]);
  loading = signal(false);
  error = signal("");
  actionLoading = signal<string | null>(null);

  // Local storage key for persistence — keeps the "TripCompleted" badge across refreshes
  private readonly STORAGE_KEY = 'tl_completed_assignments';
  completedTripIds = signal<Set<string>>(new Set());

  readonly canEdit = computed(() =>
    ["Admin", "TransportOperator"].includes(this.auth.currentRole() ?? ""),
  );

  readonly displayedColumns = [
    "fleetCode",
    "vehicleType",
    "routeCode",
    "routeName",
    "departureTime",
    "vehicleStatus",
    "actions",
  ];

  scheduleRouteMap = new Map<string, string>();

  ngOnInit(): void {
    // Load existing completed trips from LocalStorage on startup
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        const parsedArray = JSON.parse(savedData);
        this.completedTripIds.set(new Set(parsedArray));
      } catch (e) {
        console.error("Could not parse saved assignments", e);
      }
    }
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      assignments: this.assignmentService.getAll(),
      schedules: this.scheduleService.getAll(),
    }).subscribe({
      next: ({ assignments, schedules }) => {
        schedules.forEach((s) => {
          this.scheduleRouteMap.set(s.id, s.transportID);
        });
        this.assignments.set(assignments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to sync assignment data.");
        this.loading.set(false);
      },
    });
  }

  completeTrip(row: FleetAssignment): void {
    this.actionLoading.set(row.id);

    // Hit the backend so Schedule.Status becomes Inactive → Live Dashboard hides it.
    // The fleet stays InService and is NOT freed until the user releases it.
    this.assignmentService.completeTrip(row.id).subscribe({
      next: () => {
        // Keep the existing localStorage tracking for the "TripCompleted" badge.
        const currentSet = new Set(this.completedTripIds());
        currentSet.add(row.id);
        this.completedTripIds.set(currentSet);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(currentSet)));

        this.actionLoading.set(null);
        this.notify.success("Trip marked as finished. Please 'Release' the vehicle when ready.");
        this.loadAll();
      },
      error: (err) => {
        this.actionLoading.set(null);
        this.notify.error(err.error?.message ?? "Failed to complete trip.");
      },
    });
  }

  removeAssignment(a: FleetAssignment): void {
    if (!confirm("Remove this assignment? The vehicle will be released."))
      return;

    this.actionLoading.set(a.id);
    this.assignmentService.remove(a.id).subscribe({
      next: () => {
        // 1. Remove from local storage set
        const currentSet = new Set(this.completedTripIds());
        currentSet.delete(a.id);
        this.completedTripIds.set(currentSet);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(currentSet)));

        // 2. Release the Fleet Vehicle in DB
        this.fleetService.getById(a.fleetID).subscribe({
          next: (fleet) => {
            const updatedFleet = {
              ...fleet,
              status: StatusTypeInt["Available"],
            };

            this.fleetService.update(a.fleetID, updatedFleet).subscribe({
              next: () => {
                this.actionLoading.set(null);
                this.notify.success("Assignment removed and vehicle is now Available.");
                this.loadAll();
              },
            });
          },
        });
      },
      error: () => {
        this.actionLoading.set(null);
        this.notify.error("Failed to remove assignment.");
      },
    });
  }

  startTrip(a: FleetAssignment): void {
    this.actionLoading.set(a.id);
    this.assignmentService.startTrip(a.id).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.notify.success("Trip started.");
        this.loadAll();
      },
      error: (err) => {
        this.actionLoading.set(null);
        this.notify.error(err.error?.message ?? "Failed to start trip.");
      },
    });
  }

  reportDelay(a: FleetAssignment): void {
    const input = prompt("Enter delay in minutes:");
    const mins = parseInt(input ?? "0", 10);
    if (!mins || isNaN(mins) || mins <= 0) return;

    this.actionLoading.set(a.id);
    this.assignmentService.reportDelay(a.id, mins).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.notify.success(`Delay of ${mins} mins reported.`);
        this.loadAll();
      },
      error: (err) => {
        this.actionLoading.set(null);
        this.notify.error(err.error?.message ?? "Failed to report delay.");
      },
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Available: "tl-badge tl-badge--open",
      InService: "tl-badge tl-badge--free",
      UnderMaintenance: "tl-badge tl-badge--incident",
      Assigned: "tl-badge tl-badge--pending"
    };
    return map[status] ?? "tl-badge";
  }

  getFleetCode(id: string): string {
    return id ? `FL-${id.slice(0, 4).toUpperCase()}` : "FL-UNKNOWN";
  }

  getRouteIdFromSchedule(scheduleId: string): string {
    return this.scheduleRouteMap.get(scheduleId) ?? "";
  }

  createNew(): void { this.router.navigate(["/transport/assignments/new"]); }
  goToLive(): void { this.router.navigate(["/transport/live"]); }
}