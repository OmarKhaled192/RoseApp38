import { computed, inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { LoadingState, Message } from "@org/data-access";
import { NotificationService } from "../services/notification-service";

export interface NotificationState extends LoadingState {
  isLoading: boolean;
}

const initialState: NotificationState = {
  isLoading: false
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store, notificationService = inject(NotificationService)) => ({
    _notificationResource: notificationService.getNotifications(),
    _unreadCountResource: notificationService.getUnreadCount(),
  })),
  withComputed(({ _notificationResource, _unreadCountResource }) => ({
    notificationsList: computed(() => _notificationResource.value()?.payload.data || []),
    notificationsLoading: computed(() => _notificationResource.isLoading()),
    unreadCount: computed(() => _unreadCountResource.value()?.payload?.unreadCount || 0),
  })),
  withMethods((
    store,
    notificationService = inject(NotificationService),
    messageService = inject(Message),
    translate = inject(TranslateService)
  ) => ({
    reloadNotifications: () => {
      store._notificationResource.reload();
      store._unreadCountResource.reload();
    },
    markAsRead: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          notificationService.markAsRead(id).pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                store._notificationResource.reload();
                store._unreadCountResource.reload();
                messageService.show('success', translate.instant('notifications.markReadSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('notifications.markReadFailed'));
              }
            })
          )
        )
      )
    ),

    markAllAsRead: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          notificationService.markAllAsRead().pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                store._notificationResource.reload();
                store._unreadCountResource.reload();
                messageService.show('success', translate.instant('notifications.markAllReadSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('notifications.markAllReadFailed'));
              }
            })
          )
        )
      )
    ),

    deleteNotification: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          notificationService.deleteNotification(id).pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                store._notificationResource.reload();
                store._unreadCountResource.reload();
                messageService.show('success', translate.instant('notifications.deleteSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('notifications.deleteFailed'));
              }
            })
          )
        )
      )
    ),

    clearAllNotifications: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          notificationService.clearAllNotifications().pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                store._notificationResource.reload();
                store._unreadCountResource.reload();
                messageService.show('success', translate.instant('notifications.clearAllSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('notifications.clearAllFailed'));
              }
            })
          )
        )
      )
    ),

  }))
);