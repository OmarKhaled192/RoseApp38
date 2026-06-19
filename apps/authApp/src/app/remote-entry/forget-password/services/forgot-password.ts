import { Injectable } from '@angular/core';
import { ForgotPassword } from '../models/forgot-password';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService extends ApiService<ForgotPassword>  {

  protected override endpoint = 'auth/forgot-password';

  constructor(http: HttpClient) {
    super(http);
  }

}
