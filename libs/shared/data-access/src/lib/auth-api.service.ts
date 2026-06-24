import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { AuthResponse, ConfirmEmailVerificationRequest, LoginRequest, LoginResponse, RegisterRequest, SendEmailVerificationRequest } from './auth-api.interface';



@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService<LoginResponse> {
  protected override endpoint = 'auth/login';

  constructor(http: HttpClient) {
    super(http);
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
