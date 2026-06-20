import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiService } from '@org/data-access';
import { LoginRequest, LoginResponse } from '../models/login.model';

export interface SendEmailVerificationRequest {
  email: string;
}

export interface ConfirmEmailVerificationRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService<LoginResponse> {
  protected override endpoint = 'auth/login';

  constructor() {
    super(inject(HttpClient));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return of({
      status: true,
      message: 'Login successful!',
      payload: 'mock-token-xyz',
      code: 200
    } as any);
  }

  sendEmailVerification(body: SendEmailVerificationRequest): Observable<AuthResponse> {
    return of({
      status: true,
      code: 200,
      message: 'OTP sent successfully!',
      payload: ''
    });
  }

  confirmEmailVerification(body: ConfirmEmailVerificationRequest): Observable<AuthResponse> {
    return of({
      status: true,
      code: 200,
      message: 'OTP verified successfully!',
      payload: ''
    });
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return of({
      status: true,
      code: 200,
      message: 'Account created successfully!',
      payload: ''
    });
  }

}
