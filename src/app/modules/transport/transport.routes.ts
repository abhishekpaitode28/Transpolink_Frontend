import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/roles.guard";

export const TRANSPORT_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./transport-shell/transport-shell.component").then(
        (m) => m.TransportShellComponent,
      ),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./routes/route-list/route-list.component").then(
            (m) => m.RouteListComponent,
          ),
      },
      {
        path: "routes/new",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./routes/route-form/route-form.component").then(
            (m) => m.RouteFormComponent,
          ),
      },
      {
        path: "routes/:id",
        loadComponent: () =>
          import("./routes/route-detail/route-detail.component").then(
            (m) => m.RouteDetailComponent,
          ),
      },
      {
        path: "routes/:id/edit",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./routes/route-form/route-form.component").then(
            (m) => m.RouteFormComponent,
          ),
      },
      {
        path: "fleet",
        loadComponent: () =>
          import("./fleet/fleet-list/fleet-list.component").then(
            (m) => m.FleetListComponent,
          ),
      },
      {
        path: "fleet/new",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./fleet/fleet-form/fleet-form.component").then(
            (m) => m.FleetFormComponent,
          ),
      },
      {
        path: "fleet/:id/edit",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./fleet/fleet-form/fleet-form.component").then(
            (m) => m.FleetFormComponent,
          ),
      },
      {
        path: "schedules",
        loadComponent: () =>
          import("./schedules/schedule-list/schedule-list.component").then(
            (m) => m.ScheduleListComponent,
          ),
      },
      {
        path: "schedules/new",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./schedules/schedule-form/schedule-form.component").then(
            (m) => m.ScheduleFormComponent,
          ),
      },
      {
        path: "schedules/:id/edit",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./schedules/schedule-form/schedule-form.component").then(
            (m) => m.ScheduleFormComponent,
          ),
      },
      {
        path: "assignments",
        loadComponent: () =>
          import("./assignments/assignment-list/assignment-list.component").then(
            (m) => m.AssignmentListComponent,
          ),
      },
      {
        path: "assignments/new",
        canActivate: [roleGuard],
        data: { roles: ["Admin", "TransportOperator"] },
        loadComponent: () =>
          import("./assignments/assignment-form/assignment-form.component").then(
            (m) => m.AssignmentFormComponent,
          ),
      },
      {
        path: "live",
        loadComponent: () =>
          import("./live-dashboard/live-dashboard.component").then(
            (m) => m.LiveDashboardComponent,
          ),
      },
    ],
  },
];
