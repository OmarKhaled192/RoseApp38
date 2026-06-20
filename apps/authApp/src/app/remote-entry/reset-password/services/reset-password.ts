import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService extends ApiService<ResetPassword>  {

  protected override endpoint = 'auth/reset-password';

  constructor(http: HttpClient) {
    super(http);
  }

  override post(body: any): Observable<any> {
    return of({
      status: true,
      code: 200,
      message: 'Password Was Changed Successfully'
    });
  }

}
