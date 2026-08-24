import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationStore } from '../../../state/notificationStore';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './notification.html'
})
export class NotificationComponent {
  readonly notificationStore = inject(NotificationStore);

  activeMenuId = signal<string | null>(null);

  @HostListener('document:click')
  closeMenus(): void {
    this.activeMenuId.set(null);
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId.update((current) => (current === id ? null : id));
  }

  markAsRead(id: string): void {
    this.notificationStore.markAsRead(id);
    this.activeMenuId.set(null);
  }

  deleteNotification(id: string): void {
    this.notificationStore.deleteNotification(id);
    this.activeMenuId.set(null);
  }

  markAllAsRead(): void {
    this.notificationStore.markAllAsRead();
  }

  clearAll(): void {
    this.notificationStore.clearAllNotifications();
  }
}