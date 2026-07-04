import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SpecialGifts } from "../../../SpecialGifts/component/special-gifts/special-gifts";
import { TrustedBy } from '../../../Trusted by Section/components/trusted-by/trusted-by';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { ServicesHightlights } from '../../../services-highlights/component/servicesHightlights';
import { AboutUs } from './components/about-us/about-us';
import { BestSeller } from './components/best-seller/best-seller';
import { MostPopular } from './components/most-popular/most-popular';



import { RelatedProduct } from '../../../product/pages/related-product/related-product';
import { Testimonials } from '../../../sections/components/testimonials/testimonials';

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
    SpecialGifts,
    Testimonials,
    RelatedProduct,  
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  

}
