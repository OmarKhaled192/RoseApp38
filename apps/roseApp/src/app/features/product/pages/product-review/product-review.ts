import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { min, form, FormField, required, max } from '@angular/forms/signals';
import { InputComponent, Button, DarkModeService, StarRating, TitleSection, Review } from "@org/ui";
import { TranslatePipe } from '@ngx-translate/core';
import { ReviewStore } from '../../state/review.store';
@Component({
  selector: 'app-product-review',
  imports: [DatePipe, InputComponent, TranslatePipe, FormField, Button, StarRating, TitleSection],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.css']
})
export class ProductReview {
  reviews = input<Review[]>([]);
  productId = input<string>();
  private readonly reviewStore = inject(ReviewStore);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  reviewModel = signal({
    productId: this.productId() ?? '',
    headline: '',
    content: '',
    rating: 0
  });
  reviewForm = form(this.reviewModel, (schemaPath) => {
    required(schemaPath.headline, { message: 'العنوان مطلوب' });
    required(schemaPath.content, { message: 'محتوى التقييم مطلوب' });
    min(schemaPath.rating, 1, { message: 'التقييم يجب أن يكون نجمة واحدة على الأقل' });
    max(schemaPath.rating, 5, { message: 'التقييم الأعلى هو 5 نجوم' });
  });
  content = signal('');
  selectedRating = signal(0);
  hoverRating = signal(0);


  initial(review: Review): string {
    return review.user.firstName?.charAt(0).toUpperCase() ?? '?';
  }

  readonly averageRating = computed(() => {
    const list = this.reviews();
    if (!list.length) return 0;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  setHover(value: number): void {
    this.hoverRating.set(value);
  }

  clearHover(): void {
    this.hoverRating.set(0);
  }

  selectRating(value: number): void {
    this.selectedRating.set(value);
    this.reviewModel.update(currentModel => ({
      ...currentModel,
      rating: value
    }));
  }

  addReview(): void {
     this.reviewModel.update(currentModel => ({
      ...currentModel,
      productId: this.productId()!
    }));
    if (!this.reviewForm().valid()) {
      return;
    }

    this.reviewStore.addReview({ reviewData: this.reviewModel() });
  }
}
