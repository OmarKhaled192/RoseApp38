import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardList } from '../../components/card-list/card-list';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { EmptyWishlist } from '../../components/empty-wishlist/empty-wishlist';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, CardList, DeleteDialog, EmptyWishlist, TranslatePipe],
  templateUrl: './wish-list.html',
})
export class WishList {
  itemCount = 6;
  showDeleteDialog = false;
  translate = inject(TranslateService);

  products: any[] = [
    {
      id: 'p1',
      name: 'Dreamy White Roses Bouquet',
      image: 'https://placehold.co/200x200',
      rating: 4.5,
      reviewCount: 8,
      price: 199.5,
      originalPrice: 299.5,
    },
  ];

  onRemove(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
    this.itemCount = this.products.length;
  }

  removeAllProducts(): void {
    console.log('Removing all products from wishlist');
    this.products = [];
    this.itemCount = 0;
  }

  openDeleteDialog() {
    this.showDeleteDialog = true;
  }

  onAddToCart(productId: string): void {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    // Replace with a real cart service call, e.g. this.cartService.add(product);
    console.log('Added to cart:', product);
  }

  onContinueShopping(): void {
    // Navigate back to the shop/home page, e.g. this.router.navigate(['/shop']);
    console.log('Continue shopping clicked');
  }
}
