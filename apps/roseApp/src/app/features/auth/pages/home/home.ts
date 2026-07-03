import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUs } from './components/about-us/about-us';
import { TrustedBy } from '../../../Trusted by Section/components/trusted-by/trusted-by';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { ServicesHightlights } from '../../../services-highlights/component/servicesHightlights';
import { MostPopular } from './components/most-popular/most-popular';
import { BestSeller } from './components/best-seller/best-seller';

import { Card } from '@org/ui';
import { Check } from '@primeicons/angular/check';
import { RelatedProduct } from '../../../product/pages/related-product/related-product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutUs,
    TrustedBy,
    GallerySection,
    ServicesHightlights,
    MostPopular,
    BestSeller,
    
    
    RelatedProduct
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  title = 'Home';
  welcomeMessage = 'Welcome To Home';

  constructor() {
    console.log('Home Component Initialized');
  }
}
