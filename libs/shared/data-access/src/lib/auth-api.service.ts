import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
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

  constructor(http: HttpClient) {
    super(http);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginRequest, LoginResponse>(credentials);
  }
}
