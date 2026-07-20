import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-wishlist',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './empty-wishlist.html',
})
export class EmptyWishlist {
  @Output() continueShopping = new EventEmitter<void>();
}
