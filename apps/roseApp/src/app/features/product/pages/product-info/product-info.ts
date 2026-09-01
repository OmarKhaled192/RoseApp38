import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { WishlistStore } from '../../../wishlist/store/wishlistStore';
import { CartStore, ProductData } from '@org/ui';

@Component({
  selector: 'app-product-info',
  imports: [CarouselModule, TranslatePipe, DecimalPipe],
  templateUrl: './product-info.html'
})
export class ProductInfo {
  readonly cartStore = inject(CartStore);
  readonly wishlistStore = inject(WishlistStore);
  product = input<ProductData | null>(null);
  productId = input<string>();
  readonly isWishlist = computed(() => {
    const productId = this.productId();
    return !!productId && this.wishlistStore.products().some((item) => item.productId === productId);
  });
  isLoading = input<boolean>();
  readonly selectedIndex = signal(1);
  selectedImage = signal<string | null>(null);
  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) return;
      const images = this.parseImages(product.gallery);
      const cover = product.cover
      if (images[0]) {
        this.selectImage(images[0], 1);
      } else {
        this.selectedImage.set(cover);
      }
    });
  }
  selectImage(image: string, index: number) {
    this.selectedIndex.set(Number(index) || 0);
    this.selectedImage.set(image);
  }

  onSlideChange(index: number) {
    this.selectedIndex.set(Number(index) || 0);
  }


  toggleWishlist() {
    const productId = this.productId();
    if (!productId) return;
    if (this.isWishlist()) {
      this.wishlistStore.removeProductFromWishlist(productId);
    } else {
      this.wishlistStore.addProductToWishlist(productId);
    }
  }

  addToCart() {
    const productId = this.productId();
    if (!productId) return;
    this.cartStore.addToCart({ productId, quantity: 1 });
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
