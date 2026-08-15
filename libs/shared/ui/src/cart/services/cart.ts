import { HttpClient } from '@angular/common/http';
import { inject , Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { Cart } from '../models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService<Cart> {
  protected override endpoint = 'cart';

  constructor() {
    super(inject(HttpClient));
  }

}
