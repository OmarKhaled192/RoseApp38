import { Component, computed, inject, signal } from '@angular/core';
import { CartStore } from '../../../../product/state/cart.store';
import { TranslatePipe } from '@ngx-translate/core';
import {  CartItem } from '../../../models/cart.interface';
import { CommonModule } from '@angular/common';
import { InputComponent } from "@org/ui";
import { FormControl } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [TranslatePipe, CommonModule, InputComponent, RouterLink],
  templateUrl: './cart.html'
})
export class CartComponent {
  protected readonly cartStore = inject(CartStore);
  protected readonly couponCode = signal('');
  readonly cartResource = this.cartStore.getAllCart();
  protected readonly quantity = new FormControl('', { nonNullable: true });

  readonly cartItems = computed(() => this.cartResource.value()?.payload.cartItems || []);
  readonly loading = computed(() => this.cartResource.isLoading());

  protected onIncrease(item: CartItem): void {
    if (!item.id) return;
    this.cartStore.updateQuantity({ id: item.id, quantity: item.quantity + 1 , onSuccess: () => this.cartResource.reload() });
  }

  protected onDecrease(item: CartItem): void {
    if (!item.id) return;
    this.cartStore.updateQuantity({ id: item.id, quantity: item.quantity - 1  , onSuccess: () => this.cartResource.reload()});
  }

  protected onQuantityInput(item: CartItem, value: string): void {
    if (!item.id) return;
    const next = parseInt(value, 10);
    if (!Number.isNaN(next)) {
      this.cartStore.updateQuantity({ id: item.id, quantity: next , onSuccess: () => this.cartResource.reload() });
    }
  }

  protected onRemove(item: CartItem): void {
    if (!item.id) return;
    this.cartStore.removeItem(item.id);
  }

  protected onClearCart(): void {
    this.cartStore.clearCart();
  }
}
