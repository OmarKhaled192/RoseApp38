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
    return this.post(credentials);
  }

  sendEmailVerification(body: SendEmailVerificationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/send-email-verification`, body);
  }

  confirmEmailVerification(body: ConfirmEmailVerificationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/confirm-email-verification`, body);
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, body);
  }
}
