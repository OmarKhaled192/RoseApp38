import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedStepper } from '../../../shared/shared-stepper/shared-stepper';
import { OrderStore } from '../../../state/orderStore';
import { PaymentMethod as PaymentMethodEnum } from '../../../models/create-order-request';
type PaymentMethod = 'cash' | 'card';
@Component({
  selector: 'app-pyment-method',
  imports: [RouterLink, SharedStepper],
  templateUrl: './payment-method.html',
})
export class PymentMethod {
  selected = signal<PaymentMethod>('cash');
  private readonly orderStore = inject(OrderStore);
  isLoading = this.orderStore.isLoading;

  select(method: PaymentMethod): void {
    this.selected.set(method);
  }

  checkout(): void {
    // TODO: wherever the chosen address actually lives in your flow
    // (a checkout/address store, a route param, etc.) — swap this out.
    const addressId = '';

    this.orderStore.createOrder({
      addressId,
      paymentMethod:
        this.selected() === 'card'
          ? PaymentMethodEnum.CreditCard
          : PaymentMethodEnum.CashOnDelivery,
    });
  }
}
