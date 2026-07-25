import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { CouponStore } from '../../../state/coupon.store';
import { CartStore, InputComponent, CartItem } from '@org/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-checkout',
  imports: [TranslatePipe, CommonModule, InputComponent],
  templateUrl: './summary-checkout.html',
})
export class SummaryCheckout {
  protected readonly couponStore = inject(CouponStore);
  protected readonly cartStore = inject(CartStore);
  readonly cartItems = this.cartStore.cartItems;
  protected readonly couponCode = new FormControl(null);
  readonly couponList = this.couponStore.couponItems;

  readonly loading = this.couponStore.couponLoading;
  private readonly router = inject(Router);

  isPaymentPage = computed(
    () => this.router.url === '/roseApp/checkout/payment',
  );

  protected onApplyCoupon(): void {
    this.couponStore.applyCoupon(this.couponCode.value || '');
  }

  private getBasePrice(item: CartItem): number {
    return Number(item?.product?.price ?? 0);
  }
  goToAddress(): void {
    this.router.navigateByUrl('/roseApp/checkout/address');
  }

  getItemPrice(item: CartItem): number {
    const price = this.getBasePrice(item);
    const discountValue = Number(item?.product?.discountValue ?? 0);

    if (item?.product?.discountType === 'PERCENT') {
      return price - (price * discountValue) / 100;
    }

    if (item?.product?.discountType === 'FIXED') {
      return price - discountValue;
    }

    return price;
  }

  itemTotal(item: CartItem): number {
    return this.getItemPrice(item) * (item?.quantity ?? 0);
  }

  subtotal = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + this.getBasePrice(item) * (item?.quantity ?? 0),
      0,
    ),
  );

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + this.itemTotal(item), 0),
  );
}
