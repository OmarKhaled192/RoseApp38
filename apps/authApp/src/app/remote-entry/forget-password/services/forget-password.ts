import { Injectable } from '@angular/core';
import { forgetPassword } from '../models/forget-password';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class forgetPasswordService extends ApiService<forgetPassword> {

  protected override endpoint = 'auth/forget-password';

  constructor(http: HttpClient) {
    super(http);
  }

  override post(body: any): Observable<any> {
    return of({
      status: true,
      code: 200,
      message: 'New Password Has Been Sent To Your Email Successfully'
    });
  }

}
