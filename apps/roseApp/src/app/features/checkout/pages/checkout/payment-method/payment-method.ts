import { Component, computed, inject, signal } from '@angular/core';
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
  addressId = computed(() => this.orderStore.order()?.addressId ?? '');

  select(method: PaymentMethod): void {
    this.selected.set(method);
  }

  checkout(): void {
    // Read the selected address ID from the OrderStore that we set in the previous step
    const addressId = this.addressId();

    this.orderStore.createOrder({
      addressId,
      paymentMethod:
        this.selected() === 'card'
          ? PaymentMethodEnum.CreditCard
          : PaymentMethodEnum.CashOnDelivery,
    });
  }
}
