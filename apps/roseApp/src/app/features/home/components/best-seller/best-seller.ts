import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Card, Button, DarkModeService, CardData, CardAction } from '@org/ui';
import { Carousel } from 'primeng/carousel';

import { WishlistStore } from '../../../wishlist/store/wishlistStore';
import { ProductStore } from '../../../product/state/product.store';
import { mapProductToCardData } from '../../../product/services/product-to-card.mapper';

@Component({
  selector: 'app-best-seller',
  imports: [Card, Button, TranslatePipe, Carousel],
  templateUrl: './best-seller.html',
  styleUrl: './best-seller.css',
  providers: [WishlistStore],
})
export class BestSeller {
  private translateService = inject(TranslateService);
  currentLang = this.translateService.currentLang();
  private readonly darkModeService = inject(DarkModeService);
  readonly store = inject(ProductStore);
  withListstore = inject(WishlistStore);
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
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  readonly isDark = this.darkModeService.isDark;

  toggleWishlist(product: CardData) {
    const wishlistItem = product.wishlist;

    if (wishlistItem > 0) {
      this.withListstore.removeProductFromWishlist(product.id);
       product.wishlist = 0;

    } else {
      this.withListstore.addProductToWishlist(product.id);
       product.wishlist = 1;
    }

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
        action: () => this.toggleWishlist(product),
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
