import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CartStore } from '@org/ui';
import { LoadingState, Message } from '@org/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import {
  CheckoutSessionPayload,
  CheckoutSessionStatusPayload,
  CreateCheckoutSessionRequest,
} from '../models/payment';
import { PaymentService } from '../services/payment';

interface PaymentState extends LoadingState {
  checkoutUrl: string | null;
  checkoutSessionId: string | null;
  errorMessage: string | null;
}

const initialState: PaymentState = {
  checkoutUrl: null,
  checkoutSessionId: null,
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
      createCheckoutSession: rxMethod<CreateCheckoutSessionRequest>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              checkoutUrl: null,
              checkoutSessionId: null,
              errorMessage: null,
            }),
          ),
          switchMap((body) =>
            paymentService
              .post<CreateCheckoutSessionRequest, CheckoutSessionPayload>(body, '/checkout-session')
              .pipe(
                tap({
                  next: (res) => {
                    patchState(store, { isLoading: false });
                    if (!res.status || !res.payload?.checkoutUrl || !res.payload.sessionId) {
                      const errorMessage =
                        res.message || translate.instant('checkoutPayment.errors.checkoutSession');
                      patchState(store, { errorMessage });
                      messageService.show('error', errorMessage);
                      return;
                    }

                    patchState(store, {
                      checkoutUrl: res.payload.checkoutUrl,
                      checkoutSessionId: res.payload.sessionId,
                    });
                  },
                  error: (err) => {
                    const errorMessage =
                      err.error?.message || translate.instant('checkoutPayment.errors.checkoutSession');
                    patchState(store, { isLoading: false, errorMessage });
                    messageService.show('error', errorMessage);
                  },
                }),
              ),
          ),
        ),
      ),
      reconcileCheckoutSession: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, errorMessage: null })),
          switchMap((sessionId) =>
            paymentService.getCheckoutSession(sessionId).pipe(
              tap({
                next: (res) => {
                  patchState(store, { isLoading: false });
                  const payload: CheckoutSessionStatusPayload | undefined = res.payload;
                  if (!res.status || !payload) {
                    const errorMessage =
                      res.message || translate.instant('checkoutPayment.errors.checkoutStatus');
                    patchState(store, { errorMessage });
                    messageService.show('error', errorMessage);
                    return;
                  }

                  if (payload.paymentStatus.toLowerCase() !== 'paid') {
                    const errorMessage = translate.instant('checkoutPayment.errors.paymentNotCompleted');
                    patchState(store, { errorMessage });
                    messageService.show('error', errorMessage);
                    return;
                  }

                  cartStore.clearCart();
                  messageService.show('success', translate.instant('checkoutPayment.success'));
                  router.navigate(['/roseApp']);
                },
                error: (err) => {
                  const errorMessage =
                    err.error?.message || translate.instant('checkoutPayment.errors.checkoutStatus');
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
