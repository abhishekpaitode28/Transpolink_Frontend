import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subscription, EMPTY, timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Notification, NotificationFilters } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService implements OnDestroy {
  private http = inject(HttpClient);
  private readonly BASE = environment.apiBaseUrl;

  // Internal signal — bell and list components read from this
  private _myNotifications = signal<Notification[]>([]);
  readonly myNotifications  = this._myNotifications.asReadonly();
  readonly unreadCount      = computed(() =>
    this._myNotifications().filter(n => n.status === 'Unread').length
  );

  private pollSub?: Subscription;

  /** Start polling /my every 30 s. Safe to call multiple times — guards against double-subscription. */
  startPolling(): void {
    if (this.pollSub) return;
    this.pollSub = timer(0, 30_000).pipe(
      switchMap(() => this.getMyNotifications().pipe(catchError(() => EMPTY)))
    ).subscribe(data => this._myNotifications.set(data));
  }

  stopPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }

  ngOnDestroy(): void { this.stopPolling(); }

  // ── API methods ────────────────────────────────────────────────────────────

  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.BASE}/api/notifications/my`);
  }

  getAllNotifications(filters?: NotificationFilters): Observable<Notification[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.status)   params = params.set('status',   filters.status);
    if (filters?.search)   params = params.set('search',   filters.search);
    if (filters?.userId)   params = params.set('userId',   filters.userId);
    return this.http.get<Notification[]>(`${this.BASE}/api/notifications/all`, { params });
  }

  getById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.BASE}/api/notifications/${id}`);
  }

  /** Returns 204 No Content on success. */
  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.BASE}/api/notifications/${id}/mark-as-read`, {});
  }

  /** Optimistically updates the in-memory signal without a round-trip. */
  markAsReadLocally(id: string): void {
    this._myNotifications.update(list =>
      list.map(n => n.notificationID === id ? { ...n, status: 'Read' as const } : n)
    );
  }

  /** Returns 204 No Content on success. Admin only. */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/api/notifications/${id}`);
  }
}
