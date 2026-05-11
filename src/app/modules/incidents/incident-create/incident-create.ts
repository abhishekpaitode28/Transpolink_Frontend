import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IncidentType } from "../models/incident.model";
import { NotificationService } from "../../../core/services/notification.service";
import { IncidentService } from "../services/incident.service";
import { Router } from "@angular/router";

@Component({
    selector: 't1-incident-create',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './incident-create.html',
    styleUrl: './incident-create.scss'
})
export class IncidentCreateComponent{
    private notify = inject(NotificationService);
    private incidentService = inject(IncidentService);
    private router = inject(Router);

    readonly saving = signal(false);
    readonly incidentTypes: IncidentType[] = ['Accident', 'Breakdown', 'Roadblock'];


    type: IncidentType = 'Accident';
    location = '';
    date = '';
    roadSegmentId = '';

    submit() : void {
        if(!this.location.trim() || !this.date){
            this.notify.error('Location and date are required');
            return;
        }
        const isoDate = new Date(this.date).toISOString();
        this.saving.set(true);

        this.incidentService.create({
            type: this.type,
            location: this.location.trim(),
            date: isoDate,
            roadSegmentId: this.roadSegmentId.trim() || null,
        }).subscribe({
            next: () => {
                this.notify.success('Incident reported successfully');
                this.router.navigate(['/incident']);
            },
            error: () => {
                this.notify.error('Failed to report incident');
                this.saving.set(false);
            }
        })
    }

    back() : void{
        this.router.navigate(['/incident']);
    }

}