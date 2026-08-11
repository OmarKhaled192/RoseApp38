import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CouponStore } from './../../../state/coupon.store';
import { PaymentMethod as PaymentMethodEnum } from '../../../models/create-order-request';
import { SharedStepper } from '../../../shared/shared-stepper/shared-stepper';
import { OrderStore } from '../../../state/orderStore';
import { PaymentStore } from '../../../state/payment.store';

type PaymentMethod = 'cash' | 'card';

const TEST_PAYMENT_METHOD_ID = 'pm_card_visa';

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
  private requestedPaymentIntentForOrder: string | null = null;
  private confirmedPaymentIntentId: string | null = null;

  isLoading = this.orderStore.isLoading;
  isProcessingPayment = computed(
    () => this.orderStore.isLoading() || this.paymentStore.isLoading(),
  );
  addressId = computed(() => this.orderStore.order()?.addressId ?? '');
  paymentOrderId = this.orderStore.paymentOrderId;
  paymentOrderError = this.orderStore.paymentOrderError;
  paymentIntentId = this.paymentStore.paymentIntentId;
  paymentError = this.paymentStore.errorMessage;

  constructor() {
    effect(() => this.requestPaymentIntent());
    effect(() => this.confirmTestPayment());
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

  retryPaymentIntent(): void {
    const orderId = this.paymentOrderId();
    if (!orderId) {
      return;
    }

    this.requestedPaymentIntentForOrder = orderId;
    this.confirmedPaymentIntentId = null;
    this.paymentStore.createPaymentIntent({ orderId });
  }

  private requestPaymentIntent(): void {
    const orderId = this.paymentOrderId();
    if (this.selected() !== 'card' || !orderId || orderId === this.requestedPaymentIntentForOrder) {
      return;
    }

    this.requestedPaymentIntentForOrder = orderId;
    this.paymentStore.createPaymentIntent({ orderId });
  }

  private confirmTestPayment(): void {
    const paymentIntentId = this.paymentIntentId();
    if (!paymentIntentId || paymentIntentId === this.confirmedPaymentIntentId) {
      return;
    }

    this.confirmedPaymentIntentId = paymentIntentId;
    this.paymentStore.confirmPayment({
      paymentIntentId,
      paymentMethodId: TEST_PAYMENT_METHOD_ID,
    });
  }
}
