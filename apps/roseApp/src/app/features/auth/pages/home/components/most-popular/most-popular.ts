import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';

import { Card, CardAction, CardData, DarkModeService } from '@org/ui';
import { ProductData } from 'apps/roseApp/src/app/features/product/models/product';
import { Category } from 'apps/roseApp/src/app/features/product/services/category';
import { mapProductToCardData } from 'apps/roseApp/src/app/features/product/services/product-to-card.mapper';
import { ProductStore } from 'apps/roseApp/src/app/features/product/state/product-details.store';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-most-popular',
  imports: [Card, TabsModule, CommonModule],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular implements OnInit {
  private readonly darkModeService = inject(DarkModeService);
  readonly store = inject(ProductStore);
  private categories = inject(Category);
  products = signal<any[]>([]);
  wishlist = signal<Set<string>>(new Set());

  tabs = signal([{ label: 'All', value: 'all' }]);

  activeTab = signal('all');

  selectTab(value: string) {
    this.activeTab.set(value);
    if (this.activeTab() == 'all') {
      this.useProduct();
    } else {
      this.useProduct(value);
    }
    console.log('Selected tab:', value);
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
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

  getAllCateogries() {
    this.categories.getCategories(1, 20).subscribe((res) => {
      this.tabs.set([
        { label: 'All', value: 'all' },
        ...res.payload.data
          .filter((category: any) => (category._count?.products ?? 0) > 0)
          .map((category: any) => ({
            label: category.title,
            value: category.id,
          })),
      ]);
    });
  }

  useProduct(categoryId?: string) {
    const productResource = this.store.getAllProduct(() => ({
      categoryId: categoryId,
    }));
    this.products.set(productResource.value()?.payload.data ?? []);
    // return {
    //   product: computed(() => productResource.value()?.payload.data ?? null),
    //   isLoading: computed(() => productResource.isLoading()),
    // };
  }

  ngOnInit() {
    this.getAllCateogries();
    if (this.activeTab() == 'all') {
      this.useProduct();
    }
    console.log('tabs', this.tabs());
  }
}
