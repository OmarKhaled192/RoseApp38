import { Component } from '@angular/core';
import { Review, TitleSection } from '@org/ui';
import { CardReview } from '@org/ui';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonials',
  imports: [TitleSection, CarouselModule, CardReview],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  reviews: Review[] = [
    {
      id: 1,
      name: 'Jake Miller',
      avatar: './images/testimonials/jake-miller.jpg',
      rating: 1.2,
      review:
        "I've been ordering from this flower shop for years and they never disappoint. The quality and service are exceptional!",
      date: 'January 12, 2025',
    },
    {
      id: 2,
      name: 'Tyler Brooks',
      avatar: './images/testimonials/tyler-brooks.jpg',
      rating: 3,
      review:
        "Customer service is top-notch and the flowers last longer than any others I've bought. Highly recommend!",
      date: 'January 12, 2025',
    },
    {
      id: 3,
      name: 'Max Turner',
      avatar: './images/testimonials/max-turner.jpg',
      rating: 4.5,
      review:
        'The team truly cares about every order. I always feel confident when I buy flowers from here. The checkout process was superb.',
      date: 'January 12, 2025',
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
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 3 },
    },
  };
}
