import {
  ChangeDetectionStrategy, Component, OnInit,
  computed, inject, signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationsService } from '../services/notifications.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AuthService } from '../../identity/auth/auth.service';
import { Notification, CategoryFilter, StatusFilter } from '../models/notification.model';

@Component({
  selector: 'tl-notification-list',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    StatusBadgeComponent,
  ],
  templateUrl: './notification-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent implements OnInit {
  private svc = inject(NotificationsService);
  auth        = inject(AuthService);

  notifications  = signal<Notification[]>([]);
  loading        = signal(true);
  categoryFilter = signal<CategoryFilter>('All');
  statusFilter   = signal<StatusFilter>('All');
  markingAllRead = signal(false);

  readonly categories: CategoryFilter[] = ['All', 'Incident', 'Compliance', 'Transport'];
  readonly statuses:   StatusFilter[]   = ['All', 'Unread', 'Read'];

  readonly filtered = computed(() => {
    let list = this.notifications();
    const cat = this.categoryFilter();
    const st  = this.statusFilter();
    if (cat !== 'All') list = list.filter(n => n.category === cat);
    if (st  !== 'All') list = list.filter(n => n.status   === st);
    return list;
  });

  readonly unreadCount = computed(() =>
    this.notifications().filter(n => n.status === 'Unread').length
  );

  ngOnInit(): void {
    this.svc.getMyNotifications().subscribe({
      next:  data => { this.notifications.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false),
    });
  }

  setCategoryFilter(cat: CategoryFilter): void { this.categoryFilter.set(cat); }
  setStatusFilter(st: StatusFilter): void      { this.statusFilter.set(st);   }

  markRead(n: Notification): void {
    if (n.status === 'Read') return;
    this.svc.markAsRead(n.notificationID).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(item =>
            item.notificationID === n.notificationID
              ? { ...item, status: 'Read' as const }
              : item
          )
        );
        this.svc.markAsReadLocally(n.notificationID);
      },
    });
  }

  markAllRead(): void {
    const unread = this.notifications().filter(n => n.status === 'Unread');
    if (!unread.length) return;
    this.markingAllRead.set(true);

    forkJoin(unread.map(n => this.svc.markAsRead(n.notificationID))).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(item => ({ ...item, status: 'Read' as const }))
        );
        unread.forEach(n => this.svc.markAsReadLocally(n.notificationID));
        this.markingAllRead.set(false);
      },
      error: () => this.markingAllRead.set(false),
    });
  }
}
