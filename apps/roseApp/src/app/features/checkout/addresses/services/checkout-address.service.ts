import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@org/data-access';
import { CheckoutAddress } from '../models/checkout-address.model';

@Injectable({
  providedIn: 'root',
})
export class checkoutAddressService extends ApiService<CheckoutAddress> {
  protected override endpoint = 'addresses';

  constructor(http: HttpClient) {
    super(http);
  }


}
