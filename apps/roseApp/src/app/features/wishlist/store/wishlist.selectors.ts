import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistProductState } from './wishlist.reducer';

export const selectWishlistState =
  createFeatureSelector<WishlistProductState>('wishlist');

export const selectAllProductAtWishlist = createSelector(
  selectWishlistState,
  (state) => state.wishlist
);

export const selectProductWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.loading
);

export const selectProductWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);
