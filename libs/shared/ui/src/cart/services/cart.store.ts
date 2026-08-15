import { computed, inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { LoadingState, Message } from "@org/data-access";
import { CartService } from "./cart";
import { Cart, CartItem } from "../models/cart.interface";

export interface CartState extends LoadingState {
  cart: Cart;
  isLoading: boolean;
}

const initialState: CartState = {
  cart: {
    cartItems: [],
    summary: {
      subtotal: 0,
      discount: 0,
      total: 0,
      couponCode: null
    },
  },
  isLoading: false
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store, cartService = inject(CartService)) => ({
    _cartResource: cartService.getListResourceData(),
  })),
  withComputed(({ _cartResource }) => ({
    cartItems: computed(() => _cartResource.value()?.payload.cartItems || []),
    cartLoading: computed(() => _cartResource.isLoading()),
  })),
  withMethods((store, cartService = inject(CartService), messageService = inject(Message), translate = inject(TranslateService)) => ({

    addToCart: rxMethod<CartItem>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((cartData) =>
          cartService.post(cartData).pipe(
            tap({
              next: (res) => {
                patchState(store, () => ({
                  isLoading: false
                }));
                 store._cartResource.reload();
                messageService.show('success', res.message || translate.instant('cart.addSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('cart.addFailed'));
              }
            })
          )
        )
      )
    ),
    updateQuantity: rxMethod<{ id: string; quantity: number; onSuccess?: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, quantity }) =>
          cartService.patch(id, { quantity }).pipe(
            tap({
              next: () => {
                patchState(store, () => ({
                  isLoading: false
                }));
                store._cartResource.reload();
                messageService.show('success', translate.instant('cart.updateQuantitySuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('cart.updateQuantityFailed'));
              }
            })
          )
        )
      )
    ),
    removeItem: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          cartService.delete(id).pipe(
            tap({
              next: () => {
                patchState(store, () => ({
                  isLoading: false
                }));
                 store._cartResource.reload();
                messageService.show('success', translate.instant('cart.removeSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('cart.removeFailed'));
              }
            })
          )
        )
      )
    ),
    clearCart: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          cartService.deleteAll().pipe(
            tap({
              next: () => {
                patchState(store, () => ({
                  isLoading: false
                }));
                  store._cartResource.reload();
                messageService.show('success', translate.instant('cart.clearSuccess'));
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || translate.instant('cart.clearFailed'));
              }
            })
          )
        )
      )
    ),
  }))
);
