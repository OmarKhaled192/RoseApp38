import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { DashboardPayload, DashboardQuery } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends ApiService<DashboardPayload> {
  protected override endpoint = 'admin/statistics';

  constructor() {
    super(inject(HttpClient));
  }

  getDashboardResource(params: () => DashboardQuery) {
    return this.getListResourceData<DashboardPayload>('', params);
  }
}
