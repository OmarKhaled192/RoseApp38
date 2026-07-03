import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

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

  wishlist = signal<Set<string>>(new Set());

  tabs = signal<{ label: string; value: string }[]>([
    { label: 'All', value: 'all' },
  ]);

  activeTab = signal<string>('all');

  private productResource = this.store.getAllProduct(() => ({
    categoryId: this.activeTab() === 'all' ? undefined : this.activeTab(),
  }));

  readonly products = computed<CardData[]>(() => {
    const data: ProductData[] =
      this.productResource.value()?.payload.data ?? [];
    return data.map(mapProductToCardData);
  });

  readonly isLoading = computed(() => this.productResource.isLoading());

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];
  readonly isDark = this.darkModeService.isDark;

  selectTab(value: string) {
    this.activeTab.set(value);
  }

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

  getAllCategories() {
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

  ngOnInit() {
    this.getAllCategories();
  }
}
