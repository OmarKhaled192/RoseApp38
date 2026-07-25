import { Component, inject, input, output } from '@angular/core';
import { BadgeType, CardAction, CardData } from '../../models/card-type';
import { DecimalPipe, NgClass } from '@angular/common';
import { StarRating } from '../star-rating/star-rating';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CART_PORT } from '../../cart/services/cart.token';
import { CartStore } from '../../cart/services/cart.store';

@Component({
  selector: 'lib-card',
  imports: [NgClass, StarRating, DecimalPipe, TranslatePipe, RouterLink],
  templateUrl: './card.html',
    providers: [
    { provide: CART_PORT, useExisting: CartStore }
  ]
})
export class Card {
  card = input.required<CardData>();
  private readonly cart = inject(CART_PORT); 
  showWishlist = input<boolean>(false);
  // wishlistToggle = input<(() => void) | undefined>(undefined);
  hoverActions = input<CardAction[]>([]);

  footerActions(): CardAction[] {
    return [
      {
        label: 'Add to cart',
        icon: 'pi-shopping-cart',
        action: () => this.addToCart(this.card()),
        isDisabled: this.card().badges?.includes('out-of-stock'),
      },
    ];
  }

  wishlistClicked = output<string>();
  wishlistToggle = output<void>();
  readonly placeholderImage = 'https://placehold.co/600x400';

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    // Prevent infinite loop if placeholder is also missing
    img.onerror = null;

    img.src = this.placeholderImage;
  }

  badgeClass(badge: string): string {
    const variants: Record<string, string> = {
      new: 'bg-[#F4F4F5] text-gray-700 border border-gray-200',
      hot: 'bg-[#FBEAEA] text-[#A6252A]',
      'out-of-stock': 'bg-[#A6252A] text-white',
    };

    return variants[badge] ?? 'bg-white text-gray-700 border border-gray-200';
  }

  badgeLabel(badge: BadgeType): string {
    switch (badge) {
      case 'new':
        return 'NEW';
      case 'sale':
        return 'SALE';
      case 'hot':
        return 'Hot';
      case 'out-of-stock':
        return 'OUT OF STOCK';
      default:
        return badge.toUpperCase();
    }
  }

  addToCart(product: CardData) {
    const productId = product.id;
    if (!productId) return;
    this.cart.addToCart({ productId, quantity: 1 });
  }
}
