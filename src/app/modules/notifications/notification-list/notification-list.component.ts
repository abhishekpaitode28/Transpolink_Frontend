import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// TODO: import signal, computed, inject, ChangeDetectionStrategy from '@angular/core'
// TODO: import NotificationsService, Notification interface
// TODO: import StatusBadgeComponent from shared

// TODO: Define a CategoryFilter type: 'All' | 'Incident' | 'Transport' | 'Compliance'

@Component({
  selector: 'tl-notification-list',
  standalone: true,
  imports: [DatePipe],
  // TODO: also import StatusBadgeComponent
  templateUrl: './notification-list.component.html',
  // TODO: changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent implements OnInit {

  // TODO: private svc = inject(NotificationsService)

  // TODO: notifications  = signal<Notification[]>([])
  // TODO: loading        = signal(true)
  // TODO: activeFilter   = signal<CategoryFilter>('All')
  // TODO: markingAllRead = signal(false)

  // TODO: readonly categories = ['All', 'Incident', 'Transport', 'Compliance']

  // TODO: filtered = computed(() => filter notifications() by activeFilter())

  // TODO: unreadCount = computed(() => count notifications where status === 'Unread')

  ngOnInit(): void {
    // TODO: call svc.getAll().subscribe(...)
    //   next:  set notifications signal, set loading false
    //   error: set loading false
  }

  setFilter(cat: any): void {
    // TODO: activeFilter.set(cat)
  }

  markRead(notification: any): void {
    // TODO: return early if notification.status is already 'Read'
    // TODO: call svc.markAsRead(notification.id).subscribe(...)
    //   next: update the matching item in the notifications signal
  }

  markAllRead(): void {
    // TODO: set markingAllRead to true
    // TODO: call svc.markAllAsRead().subscribe(...)
    //   next:  update all notifications in signal to status 'Read', set markingAllRead false
    //   error: set markingAllRead false
  }
}
