import { computed, inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { LoadingState, Message } from "@org/data-access";
import { ProfileModel, ProfilePesponse } from "../models/profile";
import { ProfileService } from "../service/profile";
import { UploadService } from "../service/upload";

export interface ProfileState extends LoadingState {
  profile: ProfilePesponse | null;
  isLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store, profileService = inject(ProfileService)) => ({
    _profileResource: profileService.getProfile(),
  })),
  withComputed(({ _profileResource }) => ({
    profile: computed(() => _profileResource.value()?.payload || null),
    profileLoading: computed(() => _profileResource.isLoading()),
  })),

  withMethods((store, profileService = inject(ProfileService), uploadService = inject(UploadService), messageService = inject(Message), translate = inject(TranslateService)) => ({

      getProfile: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            profileService.get().pipe(
              tap({
                next: (res) => {
                  patchState(store, {
                    profile: res,
                    isLoading: false
                  });
                  store._profileResource.reload();
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.profile.loadFailed'));
                }
              })
            )
          )
        )
      ),

      updateProfile: rxMethod<ProfileModel>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((profileData) =>
            profileService.updateProfile(profileData).pipe(
              tap({
                next: () => {
                  patchState(store, { isLoading: false });
                  store._profileResource.reload();
                  messageService.show('success', translate.instant('notifications.profile.updateSuccess'));
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.profile.updateFailed'));
                }
              })
            )
          )
        )
      ),
uploadPhoto(formData: FormData) {
  patchState(store, { isLoading: true });
  return uploadService.post(formData).pipe(
        tap({
      next: () => {
        patchState(store, { isLoading: false });
        store._profileResource.reload();
        messageService.show('success', translate.instant('notifications.profile.photoUpdateSuccess'));
      },
      error: (err) => {
        patchState(store, { isLoading: false });
        messageService.show('error', err.error?.message || translate.instant('notifications.profile.photoUpdateFailed'));
      }
    })
  ); 
},


      deleteProfile: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            profileService.deleteProfile().pipe(
              tap({
                next: () => {
                  patchState(store, {
                    profile: null,
                    isLoading: false
                  });
                  store._profileResource.reload();
                  messageService.show('success', translate.instant('notifications.profile.deleteSuccess'));
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.profile.deleteFailed'));
                }
              })
            )
          )
        )
      ),

    }))
);
