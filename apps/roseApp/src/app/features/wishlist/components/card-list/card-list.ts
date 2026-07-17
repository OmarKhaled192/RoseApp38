import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './card-list.html',
})
export class CardList {
  @Input() imageUrl = 'https://placehold.co/200x200';
  @Input() title = 'Dreamy White Roses Bouquet';
  @Input() rating = 4.5;
  @Input() ratingsCount = 8;
  @Input() price = 199.5;
  @Input() originalPrice = 299.5;

  @Output() remove = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();
}

