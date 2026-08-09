import { inject } from '@angular/core';
import { tap, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, Message } from '@org/data-access';
import { Order } from '../models/order';
import { OrderService } from '../services/order';
import { CreateOrderRequest } from '../models/create-order-request';
import { CartStore } from '@org/ui';
import { Router } from '@angular/router';

export interface OrderState extends LoadingState {
  order: Order | null;
  isLoading: boolean;
}

const initialState: OrderState = {
  order: null,
  isLoading: false,
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      orderService = inject(OrderService),
      cartStore = inject(CartStore),
      router = inject(Router),
      messageService = inject(Message),
    ) => ({
      createOrder: rxMethod<CreateOrderRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((body) =>
            orderService.post(body).pipe(
              tap({
                next: (res) => {
                  patchState(store, () => ({
                    isLoading: false,
                    order: res.payload, 
                  }));
                  cartStore.clearCart();
                  messageService.show(
                    'success',
                    res.message || 'تم إنشاء الطلب بنجاح',
                  );
                  router.navigate(['/roseApp']);
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show(
                    'error',
                    err.error?.message || 'فشل إنشاء الطلب',
                  );
                },
              }),
            ),
          ),
        ),
      ),
      


      updateAddressId: (addressId: string) => {
        const currentOrder = store.order() || {
          addressId: '',
          paymentMethod: '',
          couponCode: '',
          notes: '',
        };
        patchState(store, { order: { ...currentOrder, addressId } });
      },

    }),
  ),
);
