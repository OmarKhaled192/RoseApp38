import { Component, computed, signal } from '@angular/core';
import { Card, Pagination } from '@org/ui';
import { CardAction, CardData } from '@org/ui';
import { ProductsCategory } from './components/products-category/products-category';
import { Filters } from './components/filters/filters';
import { CategoryItem, OccasionItem, ProductFilters } from './models/products.models';

@Component({
  selector: 'app-products',
  imports: [Card, Pagination, ProductsCategory, Filters],
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
      children: [
        { id: 'flowers-cards', label: 'Cards', icon: 'pi-id-card' },
        { id: 'flowers-chocolate', label: 'Chocolate', icon: 'pi-gift' },
        { id: 'flowers-cards-2', label: 'Cards', icon: 'pi-id-card' },
      ],
    },
  ];

  occasions: OccasionItem[] = [
    { id: 'wedding', label: 'Wedding', image: 'assets/occasions/wedding.jpg' },
    { id: 'anniversary', label: 'Anniversary', image: 'assets/occasions/anniversary.jpg' },
    { id: 'graduation', label: 'Graduation', image: 'assets/occasions/graduation.jpg' },
    { id: 'wedding-2', label: 'Wedding', image: 'assets/occasions/wedding-2.jpg' },
    { id: 'fathers-day', label: "Father's Day", image: 'assets/occasions/fathers-day.jpg' },
    { id: 'graduation-2', label: 'Graduation', image: 'assets/occasions/graduation-2.jpg' },
  ];

  // ---- Product source (replace with API call) ----
  private allProducts = signal<CardData[]>([
    {
      id: '1',
      image: 'assets/products/dreamy-white-roses.jpg',
      title: 'Dreamy White Roses Bouquet',
      subtitle: 'Fresh white roses bouquet',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['new'],
      inStock: true,
    },
    {
      id: '2',
      image: 'assets/products/fuchsia-brilliance-vase.jpg',
      title: 'Fuchsia Brilliance Vase',
      subtitle: 'Elegant floral vase arrangement',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['out-of-stock'],
      inStock: false,
    },
    {
      id: '3',
      image: 'assets/products/moko-chocolate-set.jpg',
      title: 'Moko Chocolate Set | Esperance',
      subtitle: 'Premium chocolate gift set',
      rating: 3,
      price: 250,
      oldPrice: 350,
      currency: 'EGP',
      badges: ['hot', 'out-of-stock'],
      inStock: false,
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
  onCategorySelect(id: string) {
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

  hoverActions(product: CardData): CardAction[] {
    return [
      {
        label: 'Add to wishlist',
        icon: this.wishlist().has(product.title) ? 'pi-heart-fill' : 'pi-heart',
        action: () => this.toggleWishlist(product),
      },
    ];
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

  private toggleWishlist(product: CardData) {
    const set = new Set(this.wishlist());
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    set.has(product.title) ? set.delete(product.title) : set.add(product.title);
    this.wishlist.set(set);
  }

  private addToCart(product: CardData) {
    // TODO: wire to cart service
    console.log('add to cart', product.title);
  }
}
