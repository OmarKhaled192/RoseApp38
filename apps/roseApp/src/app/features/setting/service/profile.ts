import { HttpClient, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService, DataResponse } from '@org/data-access';
import { ProfileModel, ProfilePesponse } from '../models/profile';
import { Observable } from 'rxjs';
import { PasswordModel, PasswordResponse, } from '../models/password';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ApiService<ProfilePesponse> {
  protected override endpoint = 'users';

  constructor() {
    super(inject(HttpClient));
  }

  getProfile(): HttpResourceRef<DataResponse<ProfilePesponse> | undefined> {
    return this.getListResourceData('/profile');
  }


  updateProfile(payload: ProfileModel): Observable<ProfilePesponse> {
    return this.patch('profile', payload);
  }

  changePassword(payload: PasswordModel): Observable<PasswordResponse<unknown>> {
    return this.post(payload, '/change-password',);
  }

  deleteProfile(): Observable<void> {
    return this.deleteAll(`/account`);
  }

}

