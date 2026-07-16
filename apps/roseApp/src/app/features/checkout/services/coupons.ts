import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { PromoCode } from '../models/promo-code.interface';

@Injectable({
  providedIn: 'root',
})
export class CouponService extends ApiService<PromoCode> {
  protected override endpoint = 'coupons';

  constructor( http: HttpClient) {
    super(http);
  }

}
