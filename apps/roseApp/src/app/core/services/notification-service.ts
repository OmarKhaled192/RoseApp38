import { HttpClient, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ApiService, DataResponse } from '@org/data-access';
import { Observable } from 'rxjs';
import { NotificationItem } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiService<NotificationItem> {
  protected override endpoint = 'notifications';

  constructor() {
    super(inject(HttpClient));
  }

  getNotifications(): HttpResourceRef<ApiResponse<NotificationItem[]> | undefined> {
    return this.getListResource();
  }

  getUnreadCount(): HttpResourceRef<DataResponse<{ unreadCount: number }> | undefined> {
    return this.getListResourceData('/unread-count');
  }

  markAsRead(id: string): Observable<NotificationItem> {
    return this.patch(`${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.patch('mark-all-read', {});
  }

  deleteNotification(id: string): Observable<void> {
    return this.delete(id);
  }

  clearAllNotifications(): Observable<void> {
    return this.deleteAll('/clear-all');
  }
}