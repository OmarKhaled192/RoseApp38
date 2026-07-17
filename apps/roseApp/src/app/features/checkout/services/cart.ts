import { Injectable } from '@angular/core';
import { ApiService, DataResponse } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromoCode } from '../models/promo-code.interface';
import { Cart } from '../models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService<Cart> {
  protected override endpoint = 'cart';

  constructor( http: HttpClient) {
    super(http);
  }

}
