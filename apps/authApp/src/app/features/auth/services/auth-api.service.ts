import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.post<LoginRequest, LoginResponse>(credentials);
  }

sendEmailVerification(body: SendEmailVerificationRequest): Observable<AuthResponse> {
    this.endpoint = 'auth/send-email-verification';
    return this.post<SendEmailVerificationRequest, AuthResponse>(body);
  }

  confirmEmailVerification(body: ConfirmEmailVerificationRequest): Observable<AuthResponse> {
    this.endpoint = 'auth/confirm-email-verification';
    return this.post<ConfirmEmailVerificationRequest, AuthResponse>(body);
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    this.endpoint = 'auth/register';
    return this.post<RegisterRequest, AuthResponse>(body);
  }

}
