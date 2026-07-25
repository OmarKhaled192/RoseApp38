import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CardList } from '../../components/card-list/card-list';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { EmptyWishlist } from '../../components/empty-wishlist/empty-wishlist';
import { WishlistStore } from '../../store/wishlistStore';
import { CartStore } from '@org/ui';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    CommonModule,
    CardList,
    DeleteDialog,
    EmptyWishlist,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './wish-list.html',
  providers: [WishlistStore],
})
export class WishList implements OnInit {
  showDeleteDialog = signal<boolean>(false);
  addToCartStore = inject(CartStore);
  store = inject(WishlistStore);

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  removeAllProducts() {
    this.store.clearWishlist();
  }

  onAddToCart(productId: string): void {
    this.addToCartStore.addToCart({ productId, quantity: 1 });
  }

  ngOnInit(): void {
    this.store.loadWishListProducts();
  }
}
