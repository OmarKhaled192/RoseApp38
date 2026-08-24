import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationStore } from '../../../state/notificationStore';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotificationItem } from '../../../models/notification';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MenuModule, ButtonModule],
  templateUrl: './notification.html'

})
export class NotificationComponent {
  readonly notificationStore = inject(NotificationStore);
  private readonly translate = inject(TranslateService);
  activeMenuId = signal<string | null>(null);

getMenuItems(item: NotificationItem): MenuItem[] {
  return [
    {
      label: this.translate.instant('notifications.markAsRead'),
      icon: 'pi pi-check',
      iconStyle: { color: '#16a34a' },
      disabled: item.isRead,
      command: () => this.markAsRead(item.id)
    },
    {
      label: this.translate.instant('notifications.delete'),
      icon: 'pi pi-trash',
      iconStyle: { color: '#dc2626' },
      command: () => this.deleteNotification(item.id)
    }
  ];
}

  @HostListener('document:click')
  closeMenus(): void {
    this.activeMenuId.set(null);
  }


  toggleMenu(id: string | null) {
    this.activeMenuId.update((currentId) => (currentId === id ? null : id));
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