import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';

import {
  Card,
  CardAction,
  CardData,
  DarkModeService,
  ProductData,
  TitleSection,
} from '@org/ui';

import { ICategory } from '../../model/category';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WishlistStore } from '../../../wishlist/store/wishlistStore';
import { ProductStore } from '../../../product/state/product.store';
import { CategoryStore } from '../../../product/state/cateory.store';
import { mapProductToCardData } from '../../../product/services/product-to-card.mapper';

@Component({
  selector: 'app-most-popular',
  imports: [Card, CommonModule, TitleSection, TranslatePipe],
  templateUrl: './most-popular.html',
  providers: [WishlistStore],
})
export class MostPopular {
  private readonly darkModeService = inject(DarkModeService);
  readonly store = inject(ProductStore);
  private categoryStore = inject(CategoryStore);
  private translateService = inject(TranslateService);
  withListstore = inject(WishlistStore);
  isRtl = document.documentElement.dir === 'ltr';
  currentLang = this.translateService.currentLang();
  wishlist = signal<Set<string>>(new Set());

  tabs = signal<{ label: string; value: string }[]>([
    { label: 'mostPopular.tabs.all', value: 'all' },
  ]);

  activeTab = signal<string>('all');

  private productResource = this.store.getAllProduct(() => ({
    categoryId: this.activeTab() === 'all' ? undefined : this.activeTab(),
  }));

  private categoryResource = this.categoryStore.getAllCategory(() => ({
    page: 1,
    limit: 20,
  }));

  readonly products = computed<CardData[]>(() => {
    const data: ProductData[] =
      this.productResource.value()?.payload.data ?? [];
    return data.map(mapProductToCardData);
  });

  categories = computed<{ label: string; value: string }[]>(() => {
    const data: ICategory[] = this.categoryResource.value()?.payload.data ?? [];

    const filterData = data
      .filter((category: ICategory) => (category._count?.products ?? 0) > 0)
      .map((category: ICategory) => ({
        label: category.title,
        value: category.id,
      }));
    return [{ label: 'All', value: 'all' }, ...filterData];
  });

  constructor() {
    this.translateService.onLangChange.subscribe(() => {
      this.isRtl = this.translateService.currentLang() === 'ar';
    });

    this.isRtl = this.translateService.currentLang() === 'ar';
    effect(() => {
      this.tabs.set(this.categories());
    });
  }

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
