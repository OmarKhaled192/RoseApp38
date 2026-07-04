import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Card, Button, DarkModeService } from '@org/ui';
import { CardAction, CardData } from 'libs/shared/ui/src/models/card-type';
import { Carousel } from 'primeng/carousel';
import { ProductStore } from '../../../product/state/product.store';
import { mapProductToCardData } from '../../../product/services/product-to-card.mapper';

@Component({
  selector: 'app-best-seller',
  imports: [Card, Button, TranslatePipe, Carousel],
  templateUrl: './best-seller.html',
})
export class BestSeller {
  private readonly darkModeService = inject(DarkModeService);
  readonly store = inject(ProductStore);

  readonly productResource = this.store.getAllProduct();
  wishlist = signal<Set<string>>(new Set());
  readonly products = computed(() => {
    const data = this.productResource.value()?.payload.data ?? [];
    return data.map(mapProductToCardData);
  });

responsiveOptions = [
  {
    breakpoint: '1400px',
    numVisible: 4,
    numScroll: 1
  },
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '576px',
    numVisible: 1,
    numScroll: 1
  }
];
  readonly isDark = this.darkModeService.isDark;

  toggleWishlist(id: string) {
    console.log('Wishlist ', id);
  }

  quickView(product: CardData) {
    console.log('quick view', product.title);
  }

  addToCart(product: CardData) {
    console.log('add to cart', product.title);
  }

  exploreGifts() {
    console.log('navigate to gifts catalog');
  }

  actionsFor(product: CardData): CardAction[] {
    const isOut = product.badges?.includes('out-of-stock') ?? false;
    return [
      {
        label: 'Favorite',
        icon: this.wishlist().has(product.id) ? 'pi-heart-fill' : 'pi-heart',
        variant: 'ghost',
        action: () => this.toggleWishlist(product.id),
      },
      {
        label: 'Quick view',
        icon: 'pi-eye',
        variant: 'ghost',
        action: () => this.quickView(product),
      },
      {
        label: 'Add to cart',
        icon: 'pi-shopping-cart',
        isDisabled: isOut,
        action: () => this.addToCart(product),
      },
    ];
  }
}
