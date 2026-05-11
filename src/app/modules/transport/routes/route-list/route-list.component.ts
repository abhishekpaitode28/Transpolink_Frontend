// routes/route-list/route-list.component.ts
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DatePipe, SlicePipe, UpperCasePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TransportRouteService } from "../../services/transport-route.service";
import { AuthService } from "../../../identity/auth/auth.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { TransportRoute } from "../../models/transport-route.model";

@Component({
  selector: "tl-route-list",
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SlicePipe,
    UpperCasePipe,
  ],
  templateUrl: "./route-list.component.html",
  styles: [
    `
      .tl-segment-table {
        /* Set fixed width for both ID columns so they align identically */
        .mat-column-fleetCode,
        .mat-column-serviceCode {
          flex: 0 0 130px;
          padding-right: 16px !important;
        }

        /* Shared badge style for FL-XXXX and RT-XXXX */
        .fleet-code-badge,
        .service-code-badge {
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.8rem;
          font-weight: 700;
          color: #2563eb;
          background-color: rgba(37, 99, 235, 0.08);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(37, 99, 235, 0.2);
          display: inline-block;
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
      }

      /* Professional header styling */
      mat-header-cell {
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
      }

      /* Ensure rows have a consistent height and vertical centering */
      .mat-row {
        min-height: 60px;
      }
    `,
  ],
})
export class RouteListComponent implements OnInit {
  private routeService = inject(TransportRouteService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  routes = signal<TransportRoute[]>([]);
  loading = signal(false);
  error = signal("");
  searchText = signal("");

  readonly canEdit = computed(() =>
    ["Admin", "TransportOperator"].includes(this.auth.currentRole() ?? ""),
  );

  readonly filteredRoutes = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if (!q) return this.routes();
    return this.routes().filter(
      (r) =>
        r.startPoint.toLowerCase().includes(q) ||
        r.endpoint.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  });

  readonly displayedColumns = [
    "serviceCode",
    "type",
    "startPoint",
    "endpoint",
    "status",
    "actions",
  ];

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.loading.set(true);
    this.error.set("");

    this.routeService.getAll().subscribe({
      next: (data) => {
        this.routes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load routes.");
        this.loading.set(false);
      },
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(["/transport/routes", id]);
  }

  createNew(): void {
    this.router.navigate(["/transport/routes/new"]);
  }

  editRoute(id: string, event: Event): void {
    event.stopPropagation();
    console.log("id received:", id);
    this.router.navigate(["/transport/routes", id, "edit"]);
  }

  deleteRoute(id: string, event: Event): void {
    event.stopPropagation();
    if (
      !confirm(
        "Delete this route? All associated schedules will also be deleted.",
      )
    )
      return;

    this.routeService.delete(id).subscribe({
      next: () => {
        this.notify.success("Route deleted successfully.");
        this.loadRoutes();
      },
      error: () => this.notify.error("Failed to delete route."),
    });
  }

  getStatusClass(status: number): string {
    return status === 0
      ? "tl-badge tl-badge--open"
      : "tl-badge tl-badge--closed";
  }

  getStatusLabel(status: number): string {
    return status === 0 ? "Active" : "Inactive";
  }

  getServiceCode(id: string): string {
    if (!id) return "RT-0000";
    return `RT-${id.slice(0, 4).toUpperCase()}`;
  }
}
