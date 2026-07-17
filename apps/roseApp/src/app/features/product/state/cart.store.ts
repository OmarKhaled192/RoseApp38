import { inject } from "@angular/core";
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, Message, QueryParams } from "@org/data-access";
import { CartService } from "../../checkout/services/cart";
import { Cart, CartItem } from "../../checkout/models/cart.interface";

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
  withMethods((store, cartService = inject(CartService), messageService = inject(Message)) => ({

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
    updateQuantity: rxMethod<{ id: string; quantity: number; onSuccess?: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, quantity, onSuccess }) =>
          cartService.patch(id, { quantity }).pipe(
            tap({
              next: () => {
                patchState(store, () => ({
                  isLoading: false
                }));
                messageService.show('success', 'تم تحديث كمية المنتج بنجاح');
                onSuccess?.();
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشلت تحديث كمية المنتج');
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

                messageService.show('success', 'تم حذف المنتج من السلة بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشلت حذف المنتج من السلة');
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

                messageService.show('success', 'تم حذف  كل المنتجات من السلة بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشلت حذف المنتج من السلة');
              }
            })
          )
        )
      )
    ),
    getAllCart(params?: () => QueryParams) {
      return cartService.getListResourceData(params);
    },
  }))
);
