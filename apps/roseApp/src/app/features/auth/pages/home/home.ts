import { AboutUs } from './components/about-us/about-us';
import { TrustedBy } from '../../../Trusted by Section/components/trusted-by/trusted-by';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { MostPopular } from './components/most-popular/most-popular';
import { CommonModule } from '@angular/common';
import { BestSeller } from './components/best-seller/best-seller';
import { SpecialGifts } from "../../../SpecialGifts/component/special-gifts/special-gifts";
import { Component } from '@angular/core';
import { Testimonials } from '../../../sections/components/testimonials/testimonials';
import { ServicesHightlights } from '../../../services-highlights/component/servicesHightlights';
import { WishList } from '../../../wishlist/pages/wish-list/wish-list';
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
    SpecialGifts,
    WishList
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent { }
