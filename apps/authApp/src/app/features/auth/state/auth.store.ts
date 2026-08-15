import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { RegisterResponse } from '../models/register';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Message } from '@org/data-access';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { LoginRequest } from '../models/login';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { AuthenticationService } from '@org/auth';


const initialState: RegisterResponse = {
  user: null,
  token: '',
  isLoading: false
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    authApiService = inject(AuthApiService),
    authService = inject(AuthenticationService),
    messageService = inject(Message),
    router = inject(Router)
  ) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((credential) => {
          return authApiService.login(credential).pipe(
            tap({
              next: (res) => {
                if (res.status) {
                  authService.setToken(res.payload.token);
                  authService.setUserData(res.payload.user);
                  messageService.show('success', res.message || 'Login successful!');
                  patchState(store, { ...res.payload , isLoading: false });
                  router.navigate(['/roseApp']);
                } else {
                  patchState(store, { isLoading: false })
                  messageService.show('error', res.message || 'Login failed');
                }
              },
              error: (err) => {
                patchState(store, { isLoading: false })
                messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
              }
            }),
            catchError(() => of(null))
          )
        })
      )
    )
  })
  )
)
