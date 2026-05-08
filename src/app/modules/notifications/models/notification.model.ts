export interface Notification {
  notificationID: string;
  userID: string;
  entityID: string;
  message: string;
  category: 'Incident' | 'Compliance' | 'Transport';
  status: 'Unread' | 'Read';
  createdDate: string;
}

export interface NotificationFilters {
  category?: 'Incident' | 'Compliance' | 'Transport';
  status?: 'Unread' | 'Read';
  search?: string;
  userId?: string;
}

export type CategoryFilter = 'All' | 'Incident' | 'Compliance' | 'Transport';
export type StatusFilter   = 'All' | 'Unread' | 'Read';
