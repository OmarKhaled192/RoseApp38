import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@org/data-access';
import { forgetPassword } from '../models/forget-password';

@Injectable({
  providedIn: 'root',
})
export class forgetPasswordService extends ApiService<forgetPassword> {
  protected override endpoint = 'auth/forgot-password';

  constructor(http: HttpClient) {
    super(http);
  }


}
