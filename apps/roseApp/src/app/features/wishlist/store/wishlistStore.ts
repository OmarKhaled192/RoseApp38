import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

import { WishlistItem } from '../model/wishlist-product';
import { WishListServices } from '../shared/services/wish-list';

interface WishListProductState {
  products: WishlistItem[];
  loading: boolean;
  error: string | null;
  searchKey: string;
}

const initialState: WishListProductState = {
  products: [],
  loading: false,
  error: null,
  searchKey: '',
};

export const WishlistStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    filterProducts: computed(() => {
      const search = store.searchKey().toLowerCase();

      return store
        .products()
        .filter((product) =>
          product.product.title.toLowerCase().includes(search),
        );
    }),

    totalProducts: computed(() => store.products().length),
  })),

  withMethods((store, api = inject(WishListServices)) => ({
    loadWishListProducts: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),
        switchMap(() =>
          api.getAllWishlistProduct().pipe(
            tap((products) => {
              patchState(store, {
                products,
                loading: false,
              });
            }),
            catchError(() => {
              patchState(store, {
                loading: false,
                error: 'Something went wrong',
              });

              return of([]);
            }),
          ),
        ),
      ),
    ),

    addProductToWishlist: rxMethod<string>(
      pipe(
        switchMap((productId) =>
          api.addProductToWishList(productId).pipe(
            switchMap(() => api.getAllWishlistProduct()),
            tap((products) => {
              patchState(store, { products });
            }),
            catchError(() => {
              patchState(store, {
                error: 'Failed to add product',
              });
              return of([]);
            }),
          ),
        ),
      ),
    ),

    removeProductFromWishlist: rxMethod<string>(
      pipe(
        switchMap((productId) =>
          api.removeProductFromWishlist(productId).pipe(
            tap(() => {
              patchState(store, {
                products: store.products().filter((p) => p.id !== productId),
              });
            }),
            catchError(() => {
              patchState(store, {
                error: 'Failed to remove product',
              });

              return of(null);
            }),
          ),
        ),
      ),
    ),

    clearWishlist: rxMethod<void>(
      pipe(
        switchMap(() =>
          api.removeAllWishlist().pipe(
            tap(() => {
              patchState(store, {
                products: [],
              });
            }),
            catchError(() => {
              patchState(store, {
                error: 'Failed to clear wishlist',
              });

              return of(null);
            }),
          ),
        ),
      ),
    ),

    // isInWishlist(productId: string): boolean {
    //   return store.products().some((item) => item.product.id === productId);
    // },

    setSearchKey(searchKey: string) {
      patchState(store, { searchKey });
    },
  })),
);
