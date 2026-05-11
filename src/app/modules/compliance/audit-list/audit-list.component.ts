import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplianceService, Audit } from '../services/compliance.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'tl-audit-list',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './audit-list.component.html',
})
export class AuditListComponent {

  private svc = inject(ComplianceService);

  allAudits = toSignal(this.svc.getAudits(), { initialValue: [] as Audit[] });

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = signal(5);
  currentPage = signal(1);

  totalPages = computed(() =>
    Math.ceil(this.allAudits().length / this.pageSize())
  );

  audits = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.allAudits().slice(start, start + this.pageSize());
  });

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  nextPage(): void { this.goToPage(this.currentPage() + 1); }
  prevPage(): void { this.goToPage(this.currentPage() - 1); }
}