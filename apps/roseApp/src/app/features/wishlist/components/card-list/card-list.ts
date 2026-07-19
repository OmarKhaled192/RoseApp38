import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './card-list.html',
})
export class CardList {
  imageUrl= input<string>();
 
  title = input('Dreamy White Roses Bouquet');
  rating = input(4.5);
  ratingsCount = input(8);
  price = input<string>('');
  originalPrice = input(299.5);

  remove = output<void>();
  addToCart = output<void>();
}

