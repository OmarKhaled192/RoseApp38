import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Cart } from '@org/ui';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService<Cart> {
  protected override endpoint = 'cart';

  constructor( http: HttpClient) {
    super(http);
  }

}
