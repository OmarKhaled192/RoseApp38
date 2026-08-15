import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './card-list.html',
})
export class CardList {
  imageUrl = input<string>();
  title = input('');
  rating = input(0);
  ratingsCount = input(0);
  price = input('');
  stock = input(0);
  originalPrice = input(0);
  remove = output<void>();
  addToCart = output<void>();
  discountType = input('');
  discountValue = input('');

  finalPrice = computed(() => {
    const price = Number(this.price());
    const discount = Number(this.discountValue());

    if (this.discountType() === 'PERCENT') {
      return price - (price * discount) / 100;
    }

    if (this.discountType() === 'FIXED') {
      return price - discount;
    }

    return price;
  });
}
