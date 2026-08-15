import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartStore, InputComponent, InputValue } from "@org/ui";
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
  readonly cartItems = this.cartStore.cartItems;
  protected readonly quantity = new FormControl('', { nonNullable: true });
  readonly loading = this.cartStore.cartLoading;


  protected onIncrease(item: CartItem): void {
    if (!item.id) return;
    this.cartStore.updateQuantity({ id: item.id, quantity: item.quantity + 1 });
  }

  protected onDecrease(item: CartItem): void {
    if (!item.id || item.quantity - 1 <= 0) return;
    this.cartStore.updateQuantity({ id: item.id, quantity: item.quantity - 1 });
  }


  protected onQuantityInput(item: CartItem, value: InputValue): void {
    if (!item.id) return;
    const next = parseInt(String(value ?? ''), 10);
    if (!Number.isNaN(next)) {
      this.cartStore.updateQuantity({ id: item.id, quantity: next });
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
