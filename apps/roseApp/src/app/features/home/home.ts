import { AboutUs } from './components/about-us/about-us';
import { MostPopular } from './components/most-popular/most-popular';
import { CommonModule } from '@angular/common';
import { BestSeller } from './components/best-seller/best-seller';
import { Component } from '@angular/core';
import { TrustedBy } from './components/Trusted by Section/components/trusted-by/trusted-by';
import { GallerySection } from './components/sections/components/gallery-section/gallery-section';
import { SpecialGifts } from './components/SpecialGifts/component/special-gifts/special-gifts';
import { Testimonials } from './components/sections/components/testimonials/testimonials';
import { ServicesHightlights } from './components/services-highlights/component/servicesHightlights';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TrustedBy,
    AboutUs,
    MostPopular,
    GallerySection,
    BestSeller,
    SpecialGifts,
    Testimonials,
    ServicesHightlights,
    SpecialGifts
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent { }
