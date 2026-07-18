import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@org/data-access';
import { CheckoutAddress } from '../models/checkout-address.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutAddressService extends ApiService<CheckoutAddress> {
  protected override endpoint = 'addresses';

  constructor() {
    super(inject(HttpClient));
  }
}
