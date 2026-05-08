import {
  ChangeDetectionStrategy, Component, ElementRef,
  HostListener, OnDestroy, OnInit, computed, inject, signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsService } from '../../services/notifications.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'tl-notification-bell',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private svc = inject(NotificationsService);
  private el  = inject(ElementRef);

  isOpen = signal(false);

  readonly unreadCount = this.svc.unreadCount;

  readonly recent = computed(() =>
    [...this.svc.myNotifications()]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 5)
  );

  ngOnInit(): void  { this.svc.startPolling(); }
  ngOnDestroy(): void { this.svc.stopPolling(); }

  toggle(): void { this.isOpen.update(v => !v); }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (target && !this.el.nativeElement.contains(target as Node)) {
      this.isOpen.set(false);
    }
  }

  markRead(n: Notification): void {
    if (n.status === 'Read') return;
    this.svc.markAsRead(n.notificationID).subscribe({
      next: () => this.svc.markAsReadLocally(n.notificationID),
    });
  }

  timeAgo(dateStr: string): string {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60_000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}
