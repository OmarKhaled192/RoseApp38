import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthApiService } from './services/auth-api.service';
import {  DataResponse, Message } from '@org/data-access';
import { LoginRequest } from './models/login';
import { RegisterResponse } from './models/register';
import { AuthenticationService } from '@org/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthenticationService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  login(credentials: LoginRequest): Observable<DataResponse<RegisterResponse>> {
    this._isLoading.set(true);
    return this.authApiService.login(credentials).pipe(
      tap({
        next: (res) => {
          this._isLoading.set(false);
          if (res.status) {
            this.authService.setToken(res.payload.token);
            this.authService.setUserData(res.payload.user);
            this.messageService.show('success', res.message || 'Login successful!');
            this.router.navigate(['/roseApp']);
          } else {
            this.messageService.show('error', res.message || 'Login failed');
          }
        },
        error: (err) => {
          this._isLoading.set(false);
          this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
        },
      })
    );
  }
}
