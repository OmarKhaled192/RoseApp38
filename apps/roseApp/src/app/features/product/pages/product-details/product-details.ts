import { Component, computed, inject, signal } from '@angular/core';
import { ProductStore } from '../../state/product.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { ProductReview } from "../product-review/product-review";
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-product-details',
  imports: [CarouselModule, ProductReview, TranslatePipe , DecimalPipe],
  templateUrl: './product-details.html'
})
export class ProductDetails {
  readonly store = inject(ProductStore);
  readonly route = inject(ActivatedRoute);
  isWishlist = signal(false);
  readonly selectedIndex = signal(1);

  productId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') || ''))
  );

  readonly productResource = this.store.getProductResource(
    computed(() => this.productId() ?? '')
  );

  readonly product = computed(() => this.productResource.value()?.payload.product);
  readonly isLoading = computed(() => this.productResource.isLoading());



  selectImage(index: number) {
    this.selectedIndex.set(index);
  }

  onSlideChange(index: number) {
    this.selectedIndex.set(index);
  }


  toggleWishlist() {
    this.isWishlist.update((v) => !v);
  }

  addToCart() {
    console.log('Added to cart:');
  }

  parseImages(data: string): string[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
