import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { ProductData } from '../../models/product';

@Component({
  selector: 'app-product-info',
  imports: [CarouselModule, TranslatePipe, DecimalPipe],
  templateUrl: './product-info.html'
})
export class ProductInfo {

  isWishlist = signal(false);
  product = input<ProductData | null>(null);
  productId = input<string>();
  isLoading = input<boolean>();
  readonly selectedIndex = signal(1);
  selectedImage = signal<string | null>(null);
  constructor() {
    effect(() => {
      console.log('1- product:', this.product());
      const product = this.product();
      if (!product) return;
      const images = this.parseImages(product.gallery);
      if (images[0]) {
        this.selectImage(images[0], 1);
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
