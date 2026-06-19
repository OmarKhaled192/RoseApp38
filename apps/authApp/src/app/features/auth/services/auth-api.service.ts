import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '@org/data-access';
import { LoginRequest, LoginResponse } from '../models/login.model';

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
}
