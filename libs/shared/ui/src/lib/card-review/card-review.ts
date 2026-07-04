import { Component, input } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'lib-card-review',
  imports: [StarRating],
  templateUrl: './card-review.html',
  styleUrl: './card-review.css',
})
export class CardReview {
  name = input.required<string>();
  avatar = input.required<string>();
  rating = input.required<number>();
  review = input.required<string>();
  date = input.required<string>();
}
