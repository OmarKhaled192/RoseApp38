
import { createAction, props } from '@ngrx/store';
import { WishlistItem, WishlistProduct } from '../model/wishlist-product';

export const loadWishlist = createAction('[Wishlist Api] Load Wishlist  ');

export const loadWishlistSuccess = createAction(
  `[Wishlist Api] Load Wishlist success`,

  props<{ wishlist: WishlistItem }>(),
);

export const loadWishlistFailuire = createAction(
  `[Wishlist Api] Load Wishlist Failuire `,
  props<{ error: string }>(),
);
