import { Component, computed, inject, signal } from '@angular/core';
import { Card, Pagination } from '@org/ui';
import { CardAction, CardData } from '@org/ui';
import { ProductsCategory } from './components/products-category/products-category';
import { Filters } from './components/filters/filters';
import { CategoryItem, OccasionItem, ProductFilters } from './models/products.models';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductData } from '../product/models/product';
import { mapProductToCardData } from '../product/services/product-to-card.mapper';
import { ProductStore } from '../product/state/product.store';

@Component({
  selector: 'app-products',
  imports: [Card, TranslatePipe, Pagination, ProductsCategory, Filters],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  // ---- Static sidebar data (replace with API calls) ----
  categories: CategoryItem[] = [
    { id: 'cards', label: 'Cards', icon: 'pi-id-card' },
    { id: 'chocolate', label: 'Chocolate', icon: 'pi-gift' },
    {
      id: 'flowers',
      label: 'Flowers',
      icon: 'pi-heart',
    },
    { id: 'cards-1', label: 'Cards', icon: 'pi-id-card' },
    { id: 'chocolate-1', label: 'Chocolate', icon: 'pi-gift' },
    { id: 'cards-2', label: 'Cards', icon: 'pi-id-card' },
  ];

  occasions: OccasionItem[] = [
    { id: 'wedding', label: 'Wedding', image: '/images/filters/occasions/wedding.jpg' },
    { id: 'anniversary', label: 'Anniversary', image: '/images/filters/occasions/wedding.jpg' },
    { id: 'graduation', label: 'Graduation', image: '/images/filters/occasions/graduation.jpg' },
    { id: 'wedding', label: 'Wedding', image: '/images/filters/occasions/wedding.jpg' },
    { id: 'fathers-day', label: "Father's Day", image: '/images/filters/occasions/fathers-day.png' },
    { id: 'graduation', label: 'Graduation', image: '/images/filters/occasions/graduation.jpg' },
  ];
  readonly store = inject(ProductStore);

  private productResource = this.store.getAllProduct();

  readonly products = computed<CardData[]>(() => {
    const data: ProductData[] =
      this.productResource.value()?.payload.data ?? [];
    return data.map(mapProductToCardData);
  });


  // ---- Product source (replace with API call) ----
  private allProducts = signal<CardData[]>([
    {
      id: '1',
      // image: 'assets/products/dreamy-white-roses.jpg',
      title: 'Dreamy White Roses Bouquet',
      subtitle: 'Fresh white roses bouquet',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['new'],
      inStock: true,
      wishlist: 24,
      create: '2026-07-01',
    },
    {
      id: '2',
      // image: 'assets/products/fuchsia-brilliance-vase.jpg',
      title: 'Fuchsia Brilliance Vase',
      subtitle: 'Elegant floral vase arrangement',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['out-of-stock'],
      inStock: false,
      wishlist: 12,
      create: '2026-06-28',
    },
    {
      id: '3',
      // image: 'assets/products/moko-chocolate-set.jpg',
      title: 'Moko Chocolate Set | Esperance',
      subtitle: 'Premium chocolate gift set',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['hot', 'out-of-stock'],
      inStock: false,
      wishlist: 31,
      create: '2026-06-25',
    },
  ]);

  // ---- State ----
  selectedCategoryId = signal<string | null>('flowers');

  filters = signal<ProductFilters>({
    categoryId: 'flowers',
    occasionIds: [],
    rating: null,
    priceFrom: null,
    priceTo: null,
  });

  page = signal(0);
  pageSize = signal(9);

  wishlist = signal<Set<string>>(new Set());

  // ---- Derived data ----
  filteredProducts = computed(() => {
    const f = this.filters();

    return this.allProducts().filter((p) => {
      if (f.rating && (p.rating ?? 0) < f.rating) return false;
      if (f.priceFrom != null && (p.price ?? 0) < f.priceFrom) return false;
      if (f.priceTo != null && (p.price ?? 0) > f.priceTo) return false;
      return true;
    });
  });

  pagedProducts = computed(() => {
    const start = this.page() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  // ---- Handlers ----
  onCategorySelect(id: string | null) {
    this.selectedCategoryId.set(id);
    this.filters.update((f) => ({ ...f, categoryId: id }));
    this.page.set(0);
  }

  onFiltersChange(next: ProductFilters) {
    this.filters.set(next);
    this.page.set(0);
  }

  onResetAll() {
    this.selectedCategoryId.set(null);
    this.filters.set({
      categoryId: null,
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


  toggleWishlist(id: string) {
    console.log('Wishlist ', id);
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
