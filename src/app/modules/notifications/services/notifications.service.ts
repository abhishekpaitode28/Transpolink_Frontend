import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: import inject from '@angular/core'
// TODO: import ApiService

// TODO: Define Notification interface — PDF Section 4.7
// Fields: id, userId, entityId, message,
//         category ('Incident'|'Transport'|'Compliance'),
//         status ('Unread'|'Read'), createdDate
export interface Notification {}

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  // TODO: private api = inject(ApiService)

  getAll(): Observable<Notification[]> {
    // TODO: return this.api.get<Notification[]>('/api/notifications')
    return {} as any;
  }

  markAsRead(id: string): Observable<Notification> {
    // TODO: return this.api.put<Notification>(`/api/notifications/${id}/read`, {})
    return {} as any;
  }

  markAllAsRead(): Observable<void> {
    // TODO: return this.api.put<void>('/api/notifications/read-all', {})
    return {} as any;
  }
}
