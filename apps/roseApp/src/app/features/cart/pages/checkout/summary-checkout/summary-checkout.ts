import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { CouponStore } from '../../../state/coupon.store';
import { InputComponent } from "@org/ui";

@Component({
  selector: 'app-summary-checkout',
  imports: [TranslatePipe, CommonModule, InputComponent],
  templateUrl: './summary-checkout.html'
})
export class SummaryCheckout {
  protected readonly couponStore = inject(CouponStore);
  protected readonly couponCode = new FormControl(null);
  readonly cartItems = input([]);
  readonly couponResource = this.couponStore.getAllCoupons();
  readonly couponList = computed(() => this.couponResource.value()?.payload.data || []);
  readonly loading = computed(() => this.couponResource.isLoading());

  protected onApplyCoupon(): void {
    this.couponStore.applyCoupon(this.couponCode.value || '');
  }
}
