import { Component, computed, inject, signal } from '@angular/core';
import { Card, Pagination, ProductData } from '@org/ui';
import { CardAction, CardData } from '@org/ui';
import { ProductsCategory } from './components/products-category/products-category';
import { Filters } from './components/filters/filters';
import { CategoryItem, IOccasion, ProductFilters } from './models/products.models';
import { TranslatePipe } from '@ngx-translate/core';
import { mapProductToCardData } from '../product/services/product-to-card.mapper';
import { ProductStore } from '../product/state/product.store';
import { CategoryStore } from '../product/state/cateory.store';
import { ICategory } from '../home/model/category';
import { OccasionStore } from '../product/state/occasion.store';
import { WishlistStore } from '../wishlist/store/wishlistStore';


@Component({
  selector: 'app-products',
  imports: [Card, TranslatePipe, Pagination, ProductsCategory, Filters],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [WishlistStore],
})
export class Products {
  readonly categoryStore = inject(CategoryStore);
  private readonly categoryResource = this.categoryStore.getAllCategory();

  readonly isCategoriesLoading = computed(() => this.categoryResource.isLoading());

  readonly categories = computed<CategoryItem[]>(() => {
    const data: ICategory[] = this.categoryResource.value()?.payload.data ?? [];
    return data.map((cat) => ({
      id: cat.id,
      label: cat.title,
      image: cat.image,
    }));
  });


  readonly occasionStore = inject(OccasionStore);
  readonly wishlistStore = inject(WishlistStore);
  private readonly occasionResource = this.occasionStore.getAllOccasion();

  readonly isOccasionsLoading = computed(() => this.occasionResource.isLoading());

  readonly occasions = computed<IOccasion[]>(() => {
    return this.occasionResource.value()?.payload.data ?? [];
  });

  readonly store = inject(ProductStore);

  private readonly productResource = this.store.getAllProduct();


  private readonly rawProducts = computed<ProductData[]>(
    () => this.productResource.value()?.payload.data ?? []
  );

  // ---- State ----
  selectedCategoryIds = signal<string[]>([]);

  filters = signal<ProductFilters>({
    categoryIds: [],
    occasionIds: [],
    rating: null,
    priceFrom: null,
    priceTo: null,
  });

  page = signal(0);
  pageSize = signal(9);

  wishlist = signal<Set<string>>(new Set());


  readonly filteredProducts = computed<ProductData[]>(() => {
    const f = this.filters();

    return this.rawProducts().filter((p) => {
      if (f.categoryIds.length && !f.categoryIds.includes(p.categoryId)) return false;

      if (f.occasionIds.length) {
        const productOccasionIds = (p.occasions as unknown as { id: string }[] | undefined ?? [])
          .map((o) => o.id);
        const hasMatch = f.occasionIds.some((id) => productOccasionIds.includes(id));
        if (!hasMatch) return false;
      }

      if (f.rating && Math.round(p.rating ?? 0) !== f.rating) return false;

      const price = Number(p.price);
      const validPriceRange =
        f.priceFrom == null || f.priceTo == null || f.priceFrom <= f.priceTo;

      if (validPriceRange) {
        if (f.priceFrom != null && price < f.priceFrom) return false;
        if (f.priceTo != null && price > f.priceTo) return false;
      }

      return true;
    });
  });

  readonly products = computed<CardData[]>(() => {
    const start = this.page() * this.pageSize();
    return this.filteredProducts()
      .slice(start, start + this.pageSize())
      .map(mapProductToCardData);
  });

  // ---- Handlers ----
  onCategorySelect(id: string) {
    this.selectedCategoryIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
    this.filters.update((f) => ({ ...f, categoryIds: this.selectedCategoryIds() }));
    this.page.set(0);
  }

  onResetCategories() {
    this.selectedCategoryIds.set([]);
    this.filters.update((f) => ({ ...f, categoryIds: [] }));
    this.page.set(0);
  }

  onFiltersChange(next: ProductFilters) {
    this.filters.set(next);
    this.page.set(0);
  }

  onResetAll() {
    this.selectedCategoryIds.set([]);
    this.filters.set({
      categoryIds: [],
      occasionIds: [],
      rating: null,
      priceFrom: null,
      priceTo: null,
    });
    this.page.set(0);
  }

  onPageChange(event: { page: number; size: number }) {
    this.page.set(event.page);
    this.pageSize.set(event.size);
  }

  footerActions(product: CardData): CardAction[] {
    return [
      {
        label: 'Add to cart',
        icon: 'pi-shopping-cart',
        action: () => this.addToCart(product),
        isDisabled: product.badges?.includes('out-of-stock'),
      },
    ];
  }

  toggleWishlist(product: CardData) {
    const wishlistItem = product.wishlist;

    if (wishlistItem > 0) {
      this.wishlistStore.removeProductFromWishlist(product.id);
      product.wishlist = 0;
    } else {
      this.wishlistStore.addProductToWishlist(product.id);
      product.wishlist = 1;
    }
  }

  private addToCart(product: CardData) {
    // TODO: wire to cart service
    console.log('add to cart', product.title);
  }

  quickView(product: CardData) {
    console.log('quick view', product.title);
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
