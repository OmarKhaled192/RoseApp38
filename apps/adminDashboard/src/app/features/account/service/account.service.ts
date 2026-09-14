import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService, DataResponse } from '@org/data-access';
import {
  AccountPayload,
  ChangePasswordRequest,
  UpdateAccountRequest,
} from '../models/account';

@Injectable({ providedIn: 'root' })
export class AdminAccountService extends ApiService<AccountPayload> {
  protected override endpoint = 'users';
  constructor() {
    super(inject(HttpClient));
  }
  getProfile() {
    return this.getListResourceData<AccountPayload>('/profile');
  }
  updateProfile(body: UpdateAccountRequest) {
    return this.patch<UpdateAccountRequest, DataResponse<AccountPayload>>(
      'profile',
      body,
    );
  }
  changePassword(body: ChangePasswordRequest) {
    return this.post<ChangePasswordRequest, unknown>(body, '/change-password');
  }
  deleteAccount() {
    return this.deleteAll<DataResponse<unknown> | null>('/account');
  }
}

@Injectable({ providedIn: 'root' })
export class AdminAccountUploadService extends ApiService<{ url: string }> {
  protected override endpoint = 'upload';
  constructor() {
    super(inject(HttpClient));
  }
}
