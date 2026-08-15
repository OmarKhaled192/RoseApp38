import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LoadingState, Message } from '@org/data-access';
import { CartStore } from '@org/ui';
import { pipe, switchMap, tap } from 'rxjs';
import { CreateOrderRequest } from '../models/create-order-request';
import { Order } from '../models/order';
import { OrderService } from '../services/order';

export interface OrderState extends LoadingState {
  order: Order | null;
  paymentOrderId: string | null;
  paymentOrderError: string | null;
}

interface CreateOrderPayload {
  order: Order;
}

const initialState: OrderState = {
  order: null,
  paymentOrderId: null,
  paymentOrderError: null,
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
      translate = inject(TranslateService),
    ) => ({
      createOrder: rxMethod<CreateOrderRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((body) =>
            orderService.post<CreateOrderRequest, CreateOrderPayload>(body).pipe(
              tap({
                next: (res) => {
                  patchState(store, () => ({
                    isLoading: false,
                    order: res.payload.order,
                  }));
                  cartStore.clearCart();
                  messageService.show('success', res.message || translate.instant('notifications.order.createdSuccess'));
                  router.navigate(['/roseApp']);
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.order.createFailed'));
                },
              }),
            ),
          ),
        ),
      ),
      createOrderForPayment: rxMethod<CreateOrderRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, paymentOrderId: null, paymentOrderError: null })),
          switchMap((body) =>
            orderService.post<CreateOrderRequest, CreateOrderPayload>(body).pipe(
              tap({
                next: (res) => {
                  const createdOrder = res.payload.order;
                  const paymentOrderId = createdOrder.id ?? createdOrder.orderId;
                  patchState(store, {
                    isLoading: false,
                    order: createdOrder,
                    paymentOrderId: paymentOrderId ?? null,
                  });
                  if (!paymentOrderId) {
                    const errorMessage = res.message || translate.instant('checkoutPayment.errors.orderId');
                    patchState(store, { paymentOrderError: errorMessage });
                    messageService.show('error', errorMessage);
                  }
                },
                error: (err) => {
                  const errorMessage = err.error?.message || translate.instant('checkoutPayment.errors.order');
                  patchState(store, { isLoading: false, paymentOrderError: errorMessage });
                  messageService.show('error', errorMessage);
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
