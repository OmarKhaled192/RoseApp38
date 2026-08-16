import { inject,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@org/data-access';
import { ResetPassword } from '../models/reset-password';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService extends ApiService<ResetPassword> {
  protected override endpoint = 'auth/reset-password';
  constructor() {
    super(inject(HttpClient));
  }


}
