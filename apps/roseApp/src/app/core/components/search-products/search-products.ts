import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchProductCard } from '../search-product-card/search-product-card';
import { ProductData } from '@org/ui';
import { ProductStore } from '../../../features/product/state/product.store';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [CommonModule, TranslatePipe, SearchProductCard],
  templateUrl: './search-products.html',
})
export class SearchProducts {
  private readonly store = inject(ProductStore);
  private readonly productResource = this.store.getAllProduct();
  private readonly query = signal('');

  @Input()
  set searchQuery(value: string) {
    this.query.set(value ?? '');
  }

  @Output() cardSelected = new EventEmitter<void>();

  readonly loading = computed(() => this.productResource.isLoading());

  readonly rawProducts = computed<ProductData[]>(() => this.productResource.value()?.payload.data ?? []);

  readonly searchResults = computed<ProductData[]>(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) {
      return [];
    }

    return this.rawProducts().filter((product) => {
      const title = (product.title ?? '').toLowerCase();
      const description = (product.description ?? '').toLowerCase();
      return title.includes(query) || description.includes(query);
    });
  });
}
