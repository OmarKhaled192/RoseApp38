import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password';
import { ApiService } from '@org/data-access';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService extends ApiService<ResetPassword>  {

  protected override endpoint = 'auth/reset-password';

  constructor(http: HttpClient) {
    super(http);
  }

}
