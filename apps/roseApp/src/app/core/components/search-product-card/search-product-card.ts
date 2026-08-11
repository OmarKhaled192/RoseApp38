import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ProductData } from '@org/ui';

@Component({
  selector: 'app-search-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './search-product-card.html',
})
export class SearchProductCard {
  @Input({ required: true }) card!: ProductData;
  @Output() selected = new EventEmitter<void>();

  get finalPrice(): string | null {
    if (!this.card.discountType || !this.card.discountValue) return null;

    const price = parseFloat(this.card.price);
    const value = parseFloat(this.card.discountValue);
    if (isNaN(price) || isNaN(value)) return null;

    const result =
      this.card.discountType === 'PERCENT'
        ? price - (price * value) / 100
        : price - value;

    return result > 0 ? result.toFixed(2) : '0.00';
  }

  onSelect(): void {
    this.selected.emit();
  }
}
