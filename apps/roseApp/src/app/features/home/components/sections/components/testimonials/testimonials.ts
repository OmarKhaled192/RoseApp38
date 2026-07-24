import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Review, ReviewCard, TitleSection } from '@org/ui';
import { CardReview } from '@org/ui';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TitleSection, CarouselModule, CardReview, TranslatePipe],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',

})
export class Testimonials {
  private translateService = inject(TranslateService)
  isArabic = this.translateService.currentLang() === 'ar';
  reviews: ReviewCard[] = [
    {
      id: 1,
      name: 'testimonials.reviews.jake.name',
      avatar: './images/testimonials/jake-miller.jpg',
      rating: 1.2,
      review: 'testimonials.reviews.jake.review',
      date: 'testimonials.reviews.jake.date',
    },
    {
      id: 2,
      name: 'testimonials.reviews.tyler.name',
      avatar: './images/testimonials/tyler-brooks.jpg',
      rating: 3,
      review: 'testimonials.reviews.tyler.review',
      date: 'testimonials.reviews.tyler.date',
    },
    {
      id: 3,
      name: 'testimonials.reviews.max.name',
      avatar: './images/testimonials/max-turner.jpg',
      rating: 4.5,
      review: 'testimonials.reviews.max.review',
      date: 'testimonials.reviews.max.date',
    },
  ];

  customOptions: OwlOptions = {
    loop: true,
    dots: false,
    nav: false,
    margin: 24,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    navSpeed: 700,
    rtl: this.translateService.currentLang() === 'ar',
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 3 },
    },
  };
}
