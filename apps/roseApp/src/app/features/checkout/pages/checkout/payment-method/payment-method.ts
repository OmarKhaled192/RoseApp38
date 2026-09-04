import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CouponStore } from './../../../state/coupon.store';
import { PaymentMethod as PaymentMethodEnum } from '../../../models/create-order-request';
import { SharedStepper } from '../../../shared/shared-stepper/shared-stepper';
import { OrderStore } from '../../../state/orderStore';
import { PaymentStore } from '../../../state/payment.store';

type PaymentMethod = 'cash' | 'card';

@Component({
  selector: 'app-pyment-method',
  imports: [RouterLink, SharedStepper, TranslatePipe],
  templateUrl: './payment-method.html',
})
export class PymentMethod {
  selected = signal<PaymentMethod>('cash');
  readonly orderStore = inject(OrderStore);
  private readonly couponStore = inject(CouponStore);
  private readonly paymentStore = inject(PaymentStore);
  private readonly route = inject(ActivatedRoute);
  private requestedCheckoutForOrder: string | null = null;
  private reconciledSessionId: string | null = null;
  private openedCheckoutSessionId: string | null = null;
  private checkoutWindow: Window | null = null;

  isLoading = this.orderStore.isLoading;
  isProcessingPayment = computed(
    () => this.orderStore.isLoading() || this.paymentStore.isLoading(),
  );
  addressId = computed(() => this.orderStore.order()?.addressId ?? '');
  paymentOrderId = this.orderStore.paymentOrderId;
  paymentOrderError = this.orderStore.paymentOrderError;
  checkoutUrl = this.paymentStore.checkoutUrl;
  checkoutSessionId = this.paymentStore.checkoutSessionId;
  paymentError = this.paymentStore.errorMessage;

  constructor() {
    effect(() => this.requestCheckoutSession());
    effect(() => this.openStripeCheckout());
    effect(() => this.reconcileReturnedCheckout());
  }

  select(method: PaymentMethod): void {
    this.selected.set(method);
    if (method === 'card' && this.addressId() && !this.paymentOrderId() && !this.orderStore.isLoading()) {
      this.checkout();
    }
  }

  checkout(): void {
    const addressId = this.addressId();
    if (this.selected() === 'card') {
      this.checkoutWindow = window.open('', '_blank');
      this.orderStore.createOrderForPayment({
        addressId,
        couponCode: this.couponStore.couponItems()[0]?.code,
        paymentMethod: PaymentMethodEnum.CreditCard,
      });
      return;
    }

    this.orderStore.createOrder({
      addressId,
      couponCode: this.couponStore.couponItems()[0]?.code,
      paymentMethod: PaymentMethodEnum.CashOnDelivery,
    });
  }

  retryCheckout(): void {
    const orderId = this.paymentOrderId();
    if (!orderId) {
      return;
    }

    this.requestedCheckoutForOrder = null;
    this.openedCheckoutSessionId = null;
    this.checkoutWindow = window.open('', '_blank');
    this.createCheckoutSession(orderId);
  }

  private requestCheckoutSession(): void {
    const orderId = this.paymentOrderId();
    if (this.selected() !== 'card' || !orderId || orderId === this.requestedCheckoutForOrder) {
      return;
    }

    this.createCheckoutSession(orderId);
  }

  private createCheckoutSession(orderId: string): void {
    this.requestedCheckoutForOrder = orderId;
    const paymentRoute = `${window.location.origin}/roseApp/checkout/payment`;
    this.paymentStore.createCheckoutSession({
      orderId,
      successUrl: `${paymentRoute}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: paymentRoute,
    });
  }

  private openStripeCheckout(): void {
    const checkoutUrl = this.checkoutUrl();
    const sessionId = this.checkoutSessionId();
    if (!checkoutUrl || !sessionId || sessionId === this.openedCheckoutSessionId) {
      return;
    }

    this.openedCheckoutSessionId = sessionId;
    if (this.checkoutWindow && !this.checkoutWindow.closed) {
      this.checkoutWindow.location.replace(checkoutUrl);
    } else {
      window.open(checkoutUrl, '_blank', 'noopener');
    }
    this.checkoutWindow = null;
  }

  private reconcileReturnedCheckout(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId || sessionId === this.reconciledSessionId) {
      return;
    }

    this.reconciledSessionId = sessionId;
    this.paymentStore.reconcileCheckoutSession(sessionId);
  }
}
