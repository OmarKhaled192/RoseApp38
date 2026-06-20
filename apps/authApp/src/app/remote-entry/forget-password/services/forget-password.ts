import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '@org/data-access';
import { AuthResponse } from '../../../features/auth/services/auth-api.service';
import { forgetPassword } from '../models/forget-password';

@Injectable({
  providedIn: 'root',
})
export class forgetPasswordService extends ApiService<forgetPassword> {
  protected override endpoint = 'auth/forgot-password';

  constructor(http: HttpClient) {
    super(http);
  }

  forgotPassword(body: forgetPassword): Observable<AuthResponse> {
    return this.post<forgetPassword, AuthResponse>(body);
  }
}
