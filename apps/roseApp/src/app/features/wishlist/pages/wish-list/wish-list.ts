import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CardList } from '../../components/card-list/card-list';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { EmptyWishlist } from '../../components/empty-wishlist/empty-wishlist';
import { Store } from '@ngrx/store';
import {
  selectAllProductAtWishlist,
  selectProductWishlistError,
  selectProductWishlistLoading,
} from '../../store/wishlist.selectors';
import { WishListServices } from '../../shared/services/wish-list';
import { loadWishlist } from '../../store/wishlist.action';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    CommonModule,
    CardList,
    DeleteDialog,
    EmptyWishlist,
    TranslatePipe,
    AsyncPipe,
  ],
  templateUrl: './wish-list.html',
})
export class WishList implements OnInit {
  itemCount = signal<number>(6);
  showDeleteDialog = signal<boolean>(false);
  translate = inject(TranslateService);
  _store = inject(Store);
  _wishListServices = inject(WishListServices);

  products$ = this._store.select(selectAllProductAtWishlist);
  loading$ = this._store.select(selectProductWishlistLoading);
  error$ = this._store.select(selectProductWishlistError);

  onRemove(productId: string): void {
    // this.products$ = this.products$.filter((p) => p.id !== productId);
    // this.itemCount.set(this.products$.length);
  }

  removeAllProducts(): void {
    // this.products$ = [];
    // this.itemCount.set(0);
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

  ngOnInit(): void {
    this.products$.subscribe({
      next: (res) => {
        console.log(res);
      },
    });
    this._store.dispatch(loadWishlist());
  }
}
