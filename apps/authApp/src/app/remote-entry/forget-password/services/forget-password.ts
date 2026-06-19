import { Injectable } from '@angular/core';
import { forgetPassword } from '../models/forget-password';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class forgetPasswordService extends ApiService<forgetPassword> {

  protected override endpoint = 'auth/forget-password';

  constructor(http: HttpClient) {
    super(http);
  }

}
