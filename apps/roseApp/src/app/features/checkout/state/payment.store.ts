import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CartStore } from '@org/ui';
import { LoadingState, Message } from '@org/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { ConfirmPaymentRequest, CreatePaymentIntentRequest } from '../models/payment';
import { PaymentService } from '../services/payment';

interface PaymentState extends LoadingState {
  paymentIntentId: string | null;
  errorMessage: string | null;
}

interface CreatePaymentIntentPayload {
  clientSecret: string;
  paymentIntentId: string;
}

const initialState: PaymentState = {
  paymentIntentId: null,
  errorMessage: null,
  isLoading: false,
};

export const PaymentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      paymentService = inject(PaymentService),
      cartStore = inject(CartStore),
      router = inject(Router),
      messageService = inject(Message),
      translate = inject(TranslateService),
    ) => ({
      createPaymentIntent: rxMethod<CreatePaymentIntentRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, paymentIntentId: null, errorMessage: null })),
          switchMap((body) =>
            paymentService.post<CreatePaymentIntentRequest, CreatePaymentIntentPayload>(body, '/create-intent').pipe(
              tap({
                next: (res) => {
                  patchState(store, { isLoading: false });
                  if (!res.status || !res.payload) {
                    const errorMessage = res.message || translate.instant('checkoutPayment.errors.intent');
                    patchState(store, { errorMessage });
                    messageService.show('error', errorMessage);
                    return;
                  }

                  patchState(store, { paymentIntentId: res.payload.paymentIntentId });
                },
                error: (err) => {
                  const errorMessage = err.error?.message || translate.instant('checkoutPayment.errors.intent');
                  patchState(store, { isLoading: false, errorMessage });
                  messageService.show('error', errorMessage);
                },
              }),
            ),
          ),
        ),
      ),
      confirmPayment: rxMethod<ConfirmPaymentRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, errorMessage: null })),
          switchMap((body) =>
            paymentService.post<ConfirmPaymentRequest>(body, '/confirm').pipe(
              tap({
                next: (res) => {
                  patchState(store, { isLoading: false });
                  if (!res.status) {
                    const errorMessage = res.message || translate.instant('checkoutPayment.errors.confirm');
                    patchState(store, { errorMessage });
                    messageService.show('error', errorMessage);
                    return;
                  }

                  messageService.show('success', res.message || translate.instant('checkoutPayment.success'));
                  cartStore.clearCart();
                  router.navigate(['/roseApp']);
                },
                error: (err) => {
                  const errorMessage = err.error?.message || translate.instant('checkoutPayment.errors.confirm');
                  patchState(store, { isLoading: false, errorMessage });
                  messageService.show('error', errorMessage);
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
