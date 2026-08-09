import { computed, inject } from "@angular/core";
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

  withMethods((store, profileService = inject(ProfileService) , uploadService = inject(UploadService), messageService = inject(Message)) => ({

    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          profileService.get().pipe(
            tap({
              next: (res) => {
                patchState(store, {
                  profile:  res,
                  isLoading: false
                });
                store._profileResource.reload();
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشل تحميل البيانات الشخصية');
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
                messageService.show('success',  'تم تحديث البيانات الشخصية بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشل تحديث البيانات الشخصية');
              }
            })
          )
        )
      )
    ),

    uploadPhoto: rxMethod<FormData>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((formData) =>
          uploadService.post(formData).pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                store._profileResource.reload();
                messageService.show('success',  'تم تحديث الصورة الشخصية بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشل تحديث الصورة الشخصية');
              }
            })
          )
        )
      )
    ),

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
                messageService.show('success',  'تم حذف الحساب بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشل حذف الحساب');
              }
            })
          )
        )
      )
    ),

  }))
);