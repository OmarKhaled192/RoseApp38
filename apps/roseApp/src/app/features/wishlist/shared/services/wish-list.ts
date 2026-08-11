import { environment } from '@org/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Product, WishlistItem, WishlistProduct } from '../../model/wishlist-product';

@Injectable({
  providedIn: 'root',
})
export class WishListServices {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.baseUrl;

  getAllWishlistProduct(): Observable<WishlistItem[]> {
    return this.http
      .get<WishlistProduct>(`${this.baseUrl}/wishlist`)
      .pipe(map((res) => res.payload.wishlistItems));
  }

  addProductToWishList(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { productId });
  }

  removeProductFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${productId}`);
  }

  removeAllWishlist(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist`);
  }

  

}
