import { Component, inject, signal } from '@angular/core';
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
  itemCount = signal<number>(6);
  showDeleteDialog = signal<boolean>(false);
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
    this.itemCount.set(this.products.length);
  }

  removeAllProducts(): void {
    this.products = [];
    this.itemCount.set(0);
  }

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  onAddToCart(productId: string): void {
    // Replace with a real cart service call, e.g. this.cartService.add(product);
  }

  onContinueShopping(): void {
    // Navigate back to the shop/home page, e.g. this.router.navigate(['/shop']);
  }
}
