import { Component, inject, signal, OnInit, computed } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { DatePipe, UpperCasePipe, SlicePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { FleetAssignmentService } from "../../services/fleet-assignment.service";
import { FleetService } from "../../services/fleet.service";
import { ScheduleService } from "../../services/schedule.service";
import { TransportRouteService } from "../../services/transport-route.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Fleet } from "../../models/fleet.model";
import { Schedule } from "../../models/schedule.model";
import { FleetAssignment } from "../../models/fleet-assignment.model";
import { StatusTypeInt } from "../../models/transport-status.enum";

@Component({
  selector: "tl-assignment-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    UpperCasePipe,
    SlicePipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: "./assignment-form.component.html",
  styles: [
    `
      .multi-line-option {
        height: auto !important;
        line-height: 1.4 !important;
        padding: 10px 16px !important;
      }
    `,
  ],
})
export class AssignmentFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private assignmentService = inject(FleetAssignmentService);
  private fleetService = inject(FleetService);
  private scheduleService = inject(ScheduleService);
  private routeService = inject(TransportRouteService);
  private notify = inject(NotificationService);

  saving = signal(false);
  loadingData = signal(false);
  error = signal("");

  allVehicles = signal<Fleet[]>([]);
  allAssignments = signal<FleetAssignment[]>([]);
  schedules = signal<Schedule[]>([]);
  routeMap = new Map<string, string>();

  availableVehicles = computed(() => {
    const busyFleetIds = new Set(
      this.allAssignments()
        .filter(
          (a) =>
            a.vehicleStatus !== "Completed" && a.vehicleStatus !== "Cancelled",
        )
        .map((a) => a.fleetID),
    );

    return this.allVehicles().filter((v) => {
      const isNotAssigned = !busyFleetIds.has(v.id);
      const isReadyStatus =
        Number(v.status) === StatusTypeInt["Available"] ||
        v.status === "Available";
      return isNotAssigned && isReadyStatus;
    });
  });

  // Only schedules whose departure is in the future — you can't
  // assign a vehicle to a trip that already left.
  upcomingSchedules = computed(() => {
    const now = Date.now();
    return this.schedules().filter(
      (s) => new Date(s.departureTime).getTime() > now,
    );
  });

  form: FormGroup = this.fb.group({
    fleetID: ["", Validators.required],
    scheduleID: ["", Validators.required],
  });

  ngOnInit(): void {
    this.loadingData.set(true);
    this.error.set("");

    const preFleetId = this.route.snapshot.queryParams["fleetId"];
    const preScheduleId = this.route.snapshot.queryParams["scheduleId"];

    forkJoin({
      vehicles: this.fleetService.getAll(),
      schedules: this.scheduleService.getAll(),
      routes: this.routeService.getAll(),
      assignments: this.assignmentService.getAll(),
    }).subscribe({
      next: ({ vehicles, schedules, routes, assignments }) => {
        routes.forEach((r: any) => {
          const serviceCode = `RT-${r.id.slice(0, 4).toUpperCase()}`;
          this.routeMap.set(
            r.id,
            `${serviceCode} | ${r.startPoint} → ${r.endpoint}`,
          );
        });

        this.allVehicles.set(vehicles);
        this.allAssignments.set(assignments);
        this.schedules.set(schedules);
        this.loadingData.set(false);

        if (preFleetId) this.form.patchValue({ fleetID: preFleetId });
        if (preScheduleId) this.form.patchValue({ scheduleID: preScheduleId });
      },
      error: () => {
        this.error.set("Failed to load required data.");
        this.loadingData.set(false);
      },
    });
  }

  getRouteInfo(transportID: string): string {
    return this.routeMap.get(transportID) ?? "Unknown Route";
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.assignmentService.assign(this.form.value).subscribe({
      next: () => {
        this.notify.success("Vehicle assigned successfully.");
        this.router.navigate(["/transport/assignments"]);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message ?? "Assignment failed.");
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/transport/assignments"]);
  }

  getVehicleLabel(v: Fleet): string {
    if (!v || !v.id) return "Unknown Vehicle";
    const code = `FL-${v.id.slice(0, 4).toUpperCase()}`;
    return `${code} - ${v.vehicleType} (Cap: ${v.capacity})`;
  }

  goToFleet(): void {
    this.router.navigate(["/transport/fleet"]);
  }
}