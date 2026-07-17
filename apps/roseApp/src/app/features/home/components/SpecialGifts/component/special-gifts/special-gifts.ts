import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BannerSlide, FeaturedCard } from '../../models/specialgift.interface';

@Component({
  selector: 'app-special-gifts',
  imports: [CommonModule, CarouselModule, TranslatePipe],
  templateUrl: './special-gifts.html',
})
export class SpecialGifts {
  isRtl = document.documentElement.dir === 'ltr';
  private translateService = inject(TranslateService)
  currentLang = this.translateService.currentLang();
  constructor() {
    this.translateService.onLangChange.subscribe(() => {
      this.isRtl = this.translateService.currentLang() === 'ar';
    });

    this.isRtl = this.translateService.currentLang() === 'ar';
  }
  slides = signal<BannerSlide[]>([
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
  ]);

  cards = signal<FeaturedCard[]>([
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
  ]);
}
