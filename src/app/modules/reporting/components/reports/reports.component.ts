import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  GenerateReportRequest,
  GenerateReportResponse,
  ScheduleReportRequest,
  ReportScope,
  ReportFrequency,
  ReportFormat,
} from '../../models/report.model';
import { ReportService } from '../../services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
@Component({
  selector: 'tl-reports',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit{

    private reportSvc=inject(ReportService);
    private notify=inject(NotificationService)
    private router=inject(Router);

    readonly scopes:ReportScope[]=['Incident','Compliance','Traffic','Transport','General'];
    readonly frequencies:ReportFrequency[]=['Daily','Monthly','Weekly'];
    readonly formats:ReportFormat[]=['CSV','JSON','PDF'];


    loading=signal(true);
    generating=signal(false);
    scheduling=signal(false);
    reports=signal<GenerateReportResponse[]>([]);


    generateForm=signal<GenerateReportRequest>({
        scope:'General',
        fromDate:'',
        toDate:'',
        format:'PDF'
    });

    scheduleForm=signal<ScheduleReportRequest>({
        scope:'General',
        frequency:'Daily',
        format:'PDF'
    })

    sortedReports = computed(() =>
    [...this.reports()].sort(
      (a, b) =>
        new Date(b.generatedDate).getTime() -new Date(a.generatedDate).getTime()
    )
  );

  totalReports=computed(()=>this.reports().length);

  countByScope=computed(()=>{
    const counts:Record<string,number>={};
    for(const r of this.reports()){
        counts[r.scope]=(counts[r.scope]??0)+1;
    }
    return counts;
  })

    ngOnInit(): void {
          this.loadHistory();
    }


    goBack():void {
        this.router.navigate(['/reporting']);
    }

    refresh():void {
        this.loading.set(true);
        this.loadHistory();
    }

    onGenerate():void{
        if(this.generating()){
            return;
        }

        const form=this.generateForm();
        this.generating.set(true);
        const payload: GenerateReportRequest = {
    scope: form.scope,
    format: form.format,
    ...(form.fromDate ? { fromDate: form.fromDate } : {}),
    ...(form.toDate   ? { toDate:   form.toDate   } : {}),
  };


        this.reportSvc.generate(payload)
        .pipe(finalize(()=>this.generating.set(false)))
        .subscribe({
            next:(created)=>{
                this.reports.update(list=>[created,...list]);
                this.notify.success(`${form.scope} report generated sucessfully`);
                this.resetGenerateForm();
            },
            error:()=>{
                this.notify.error(`falied to generate ${form.scope} report`)
            }
        });
        
    }

    onSchedule():void{
        if (this.scheduling()) return;

    const form = this.scheduleForm();
    this.scheduling.set(true);

    this.reportSvc.schedule(form)
      .pipe(finalize(() => this.scheduling.set(false)))
      .subscribe({
        next: (scheduled) => {
          this.notify.success(
            `${scheduled.frequency} ${scheduled.scope} report scheduled. Next run: ${new Date(scheduled.nextRunAt).toLocaleString()}.`
          );
          this.resetScheduleForm();
        },
        error: () => {
          this.notify.error(`Failed to schedule ${form.scope} report.`);
        },
      });
    }

    statusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'completed' || normalized === 'generated') return 'tl-status--success';
    if (normalized === 'pending') return 'tl-status--warning';
    if (normalized === 'failed')  return 'tl-status--danger';
    return 'tl-status--neutral';
  }

  private loadHistory():void{
    this.reportSvc.getHistory()
    .pipe(finalize(()=>this.loading.set(false)))
    .subscribe({
        next:(list)=>this.reports.set(list),
        error:()=>{
            this.notify.error('failed to load report histroy')
        }
    })
  }
  private resetGenerateForm(): void {
    this.generateForm.set({
      scope:    'General',
      fromDate: '',
      toDate:   '',
      format:   'PDF',
    });
  }

  private resetScheduleForm(): void {
    this.scheduleForm.set({
      scope:     'General',
      frequency: 'Daily',
      format:    'PDF',
    });
  }

}