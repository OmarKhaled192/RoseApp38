import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiService, DataResponse } from '@org/data-access';
import { LoginRequest } from '../models/login';
import { ConfirmEmailVerificationRequest, SendEmailVerificationRequest } from '../models/verification-messages';
import { RegisterRequest, RegisterResponse } from '../models/register';



@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService<LoginRequest> {
  protected override endpoint = 'auth/';

  constructor() {
    super(inject(HttpClient));
  }

  login(body: LoginRequest): Observable<DataResponse<RegisterResponse>> {
     return this.post(body,`login`);
  }

  sendEmailVerification(body: SendEmailVerificationRequest): Observable<ApiResponse<void>> {
     return this.post(body,`send-email-verification`);
  }

  confirmEmailVerification(body: ConfirmEmailVerificationRequest): Observable<ApiResponse<void>> {
    return this.post(body,`confirm-email-verification`);
  }

  register(body: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.post(body,`register`);
  }
}
