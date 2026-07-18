import { inject, Injectable } from "@angular/core";
import { ApiService } from "@org/data-access";
import { CheckoutAddress } from "../models/checkout-address.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class CheckoutAddressService extends ApiService<CheckoutAddress> {
  protected override endpoint = 'addresses';

  constructor() {
    super(inject(HttpClient));
  }


}
