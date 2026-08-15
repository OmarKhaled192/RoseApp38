import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { CouponStore } from '../../../state/coupon.store';
import { CartStore, InputComponent, CartItem } from '@org/ui';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

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

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.url),
    ),
    { initialValue: this.router.url },
  );

  isPaymentPage = computed(
    () => this.currentUrl() !== '/roseApp/checkout/payment',
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
