import { Component,  input, signal } from '@angular/core';
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
  readonly selectedIndex = signal(1);
  selectedImage = signal<string | null>(null);
  product = input<ProductData | null>(null);
  productId = input<string>();
  isLoading = input<boolean>();


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
