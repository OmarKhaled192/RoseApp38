import { inject } from "@angular/core";
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, Message } from "@org/data-access";
import { Cart } from "../models/cart";
import { CartService } from "../services/cart";

export interface CartState extends LoadingState {
  cart: Cart[];
  isLoading: boolean;
}

const initialState: CartState = {
  cart: [],
  isLoading: false
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, cartService = inject(CartService), messageService = inject(Message)) => ({

    addToCart: rxMethod<Cart>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((cartData) =>
          cartService.post(cartData).pipe(
            tap({
              next: (res) => {
                patchState(store, (state) => ({
                  cart: [...state.cart, cartData],
                  isLoading: false
                }));

                messageService.show('success', res.message || 'تم إضافة المنتج للسلة بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشلت إضافة المنتج للسلة');
              }
            })
          )
        )
      )
    ),

  }))
);
