import { environment } from '@org/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishListServices {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.baseUrl;

  getAllWishlistProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/wishlist`);
  }

  addProductToWishList(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { productId });
  }
  
}
