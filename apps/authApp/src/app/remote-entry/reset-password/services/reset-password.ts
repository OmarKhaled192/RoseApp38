import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '@org/data-access';
import { AuthResponse } from '../../../features/auth/services/auth-api.service';
import { ResetPassword } from '../models/reset-password';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService extends ApiService<ResetPassword> {
  protected override endpoint = 'auth/reset-password';

  constructor(http: HttpClient) {
    super(http);
  }

  resetPassword(body: ResetPassword): Observable<AuthResponse> {
    return this.post<ResetPassword, AuthResponse>(body);
  }
}
