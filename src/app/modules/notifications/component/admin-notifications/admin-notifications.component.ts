import {
  ChangeDetectionStrategy, Component, OnInit,
  computed, inject, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NotificationsService } from '../../services/notifications.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Notification, CategoryFilter, StatusFilter } from '../../models/notification.model';

@Component({
  selector: 'tl-admin-notifications',
  standalone: true,
  imports: [
    FormsModule, DatePipe, RouterLink,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    MatCardModule, MatTooltipModule,
    StatusBadgeComponent,
  ],
  templateUrl: './admin-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNotificationsComponent implements OnInit {
  private svc = inject(NotificationsService);

  notifications = signal<Notification[]>([]);
  loading       = signal(true);
  deleting      = signal<string | null>(null);

  categoryFilter = signal<CategoryFilter | ''>('');
  statusFilter   = signal<StatusFilter | ''>('');
  searchText     = signal('');
  userIdFilter   = signal('');

  // Pagination
  currentPage = signal(1);
  pageSize    = signal(10);

  readonly total       = computed(() => this.notifications().length);
  readonly totalUnread = computed(() => this.notifications().filter(n => n.status === 'Unread').length);
  readonly incidents   = computed(() => this.notifications().filter(n => n.category === 'Incident').length);
  readonly compliance  = computed(() => this.notifications().filter(n => n.category === 'Compliance').length);
  readonly transport   = computed(() => this.notifications().filter(n => n.category === 'Transport').length);

  readonly filtered = computed(() => {
    const q   = this.searchText().toLowerCase().trim();
    const cat = this.categoryFilter();
    const st  = this.statusFilter();
    return this.notifications().filter(n => {
      if (cat && n.category !== cat) return false;
      if (st  && n.status   !== st)  return false;
      if (q   && !n.message.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / this.pageSize()) || 1
  );

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.currentPage.set(1);
    const filters = this.userIdFilter() ? { userId: this.userIdFilter() } : undefined;
    this.svc.getAllNotifications(filters).subscribe({
      next:  data => { this.notifications.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false),
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  delete(n: Notification): void {
    this.deleting.set(n.notificationID);
    this.svc.delete(n.notificationID).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.filter(item => item.notificationID !== n.notificationID)
        );
        this.deleting.set(null);
      },
      error: () => this.deleting.set(null),
    });
  }

  clearFilters(): void {
    this.categoryFilter.set('');
    this.statusFilter.set('');
    this.searchText.set('');
    this.currentPage.set(1);
  }
}