import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-special-gifts',
  imports: [CommonModule, CarouselModule, TranslatePipe],
  templateUrl: './special-gifts.html',
})
export class SpecialGifts {
  private readonly translate = inject(TranslateService);

  slides = [
    {
      image: '/images/SpecialGifts/carousel.png',
      titleKey: 'specialGifts.slides.flowers.title',
      subtitleKey: 'specialGifts.slides.flowers.subtitle',
      ctaLabelKey: 'specialGifts.slides.flowers.ctaLabel',
      ctaLink: '/category/flowers',
    },
    {
      image: '/images/SpecialGifts/carousel.png',
      titleKey: 'specialGifts.slides.chocolates.title',
      subtitleKey: 'specialGifts.slides.chocolates.subtitle',
      ctaLabelKey: 'specialGifts.slides.chocolates.ctaLabel',
      ctaLink: '/category/chocolates',
    },
    {
      image: '/images/SpecialGifts/carousel.png',
      titleKey: 'specialGifts.slides.flowers.title',
      subtitleKey: 'specialGifts.slides.flowers.subtitle',
      ctaLabelKey: 'specialGifts.slides.flowers.ctaLabel',
      ctaLink: '/category/flowers',
    },
  ];

  cards = [
    {
      image: '/images/SpecialGifts/wedding.png',
      badgeKey: 'specialGifts.cards.wedding.badge',
      titleKey: 'specialGifts.cards.wedding.title',
    },
    {
      image: '/images/SpecialGifts/Engagement.png',
      badgeKey: 'specialGifts.cards.engagement.badge',
      titleKey: 'specialGifts.cards.engagement.title',
    },
    {
      image: '/images/SpecialGifts/Anniversary.png',
      badgeKey: 'specialGifts.cards.anniversary.badge',
      titleKey: 'specialGifts.cards.anniversary.title',
    },
  ];
}
