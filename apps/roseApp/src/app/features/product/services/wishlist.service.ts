import { inject , Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Wishlist } from "../models/wishlist";

@Injectable({
  providedIn: 'root',
})
export class WishlistService extends ApiService<Wishlist> {
  protected override endpoint = 'wishlist';

  constructor() {
    super(inject(HttpClient));
  }

  

}
