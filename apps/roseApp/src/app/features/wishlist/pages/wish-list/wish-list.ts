import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '@ngx-translate/core';
import { CardList } from '../../components/card-list/card-list';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { EmptyWishlist } from '../../components/empty-wishlist/empty-wishlist';
import { WishlistStore } from '../../store/wishlistStore';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, CardList, DeleteDialog, EmptyWishlist, TranslatePipe, RouterLink],
  templateUrl: './wish-list.html',
  providers: [WishlistStore],
})
export class WishList implements OnInit {
  showDeleteDialog = signal<boolean>(false);

  store = inject(WishlistStore);

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  removeAllProducts() {
    this.store.clearWishlist();
  }

  onAddToCart(productId: string): void {
    // Replace with a real cart service call, e.g. this.cartService.add(product);
  }



  ngOnInit(): void {
    this.store.loadWishListProducts();
  }
}
