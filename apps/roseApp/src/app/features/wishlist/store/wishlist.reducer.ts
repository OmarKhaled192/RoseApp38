import { createReducer, on } from "@ngrx/store";
import { WishlistItem } from "../model/wishlist-product";
import * as WishlistAction from "./wishlist.action";  


export interface WishlistProductState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export const initialState: WishlistProductState = {
  wishlist: [],
  loading: false,
  error: null,
};

export const wishlistReducer = createReducer(
  initialState,
  on(WishlistAction.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistAction.loadWishlistSuccess, (state, { wishlist }) => ({
    ...state,
    wishlist: Array.isArray(wishlist) ? wishlist : [...state.wishlist, wishlist],
    loading: false,
    error: null,
  })),
  on(WishlistAction.loadWishlistFailuire, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);