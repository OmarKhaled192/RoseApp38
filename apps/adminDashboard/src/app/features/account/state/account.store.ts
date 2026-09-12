import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  map,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '@org/auth';
import { Message } from '@org/data-access';
import {
  AdminAccountService,
  AdminAccountUploadService,
} from '../service/account.service';
import { UpdateAccountRequest } from '../models/account';

export const AdminAccountStore = signalStore(
  withState(() => ({
    user: inject(AuthenticationService).getUserData(),
    isSaving: false,
    isDeleting: false,
    savedVersion: 0,
  })),
  withProps((store, api = inject(AdminAccountService)) => ({
    _profileResource: api.getProfile(),
  })),
  withComputed(({ _profileResource }) => ({
    isLoading: computed(() => _profileResource.isLoading()),
    hasLoadError: computed(
      () =>
        !!_profileResource.error() ||
        _profileResource.value()?.status === false,
    ),
    hasProfile: computed(
      () =>
        !!_profileResource.value()?.payload?.user &&
        _profileResource.value()?.status === true,
    ),
  })),
  withMethods(
    (
      store,
      api = inject(AdminAccountService),
      upload = inject(AdminAccountUploadService),
      auth = inject(AuthenticationService),
      message = inject(Message),
      router = inject(Router),
    ) => ({
      reload: () => store._profileResource.reload(),
      save: rxMethod<{ profile: UpdateAccountRequest; file: File | null }>(
        pipe(
          exhaustMap(({ profile, file }) => {
            patchState(store, { isSaving: true });
            const body = new FormData();
            if (file) body.append('image', file);
            const photo$ = file
              ? upload.post<FormData>(body).pipe(
                  map((res) => {
                    if (!res.status || !res.payload?.url)
                      throw new Error(res.message || 'adminAccount.saveFailed');
                    return res.payload.url;
                  }),
                )
              : of(profile.photo);
            return photo$.pipe(
              switchMap((photo) =>
                api
                  .updateProfile({ ...profile, photo })
                  .pipe(map((response) => ({ response, photo }))),
              ),
              tap(({ response, photo }) => {
                if (!response.status)
                  throw new Error(
                    response.message || 'adminAccount.saveFailed',
                  );
                const currentUser = store.user();
                if (currentUser) {
                  const user = {
                    ...currentUser,
                    ...profile,
                    ...(response.payload?.user ?? {}),
                    photo,
                  };
                  patchState(store, { user });
                  auth.setUserData(user);
                }
                patchState(store, { savedVersion: store.savedVersion() + 1 });
                store._profileResource.reload();
                message.show('success', 'adminAccount.saved');
              }),
              catchError((error) => {
                message.show(
                  'error',
                  error.error?.message ||
                    error.message ||
                    'adminAccount.saveFailed',
                );
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false })),
            );
          }),
        ),
      ),
      deleteAccount: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            patchState(store, { isDeleting: true });
            return api.deleteAccount().pipe(
              tap((response) => {
                if (response && !response.status)
                  throw new Error(
                    response.message || 'adminAccount.deleteFailed',
                  );
                auth.removeToken();
                patchState(store, { user: null });
                message.show('success', 'adminAccount.deleted');
                void router.navigateByUrl('/auth/login');
              }),
              catchError((error) => {
                message.show(
                  'error',
                  error.error?.message ||
                    error.message ||
                    'adminAccount.deleteFailed',
                );
                return EMPTY;
              }),
              finalize(() => patchState(store, { isDeleting: false })),
            );
          }),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      effect(() => {
        const response = store._profileResource.value();
        if (response?.status && response.payload?.user)
          patchState(store, { user: response.payload.user });
      });
    },
  }),
);
