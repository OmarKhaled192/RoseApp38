import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { Card, CardAction } from '@org/ui';
import { Check } from '@primeicons/angular/check';
import { MostPopular } from './components/most-popular/most-popular';
import { BestSeller } from '../best-seller/best-seller';
@Component({
  selector: 'app-home',
  imports: [CommonModule, Card, Check, MostPopular, GallerySection,BestSeller],
import { ServicesHightlights } from "../../../services-highlights/component/servicesHightlights";
import { BestSeller } from '../best-seller/best-seller';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { BestSeller } from './components/best-seller/best-seller';

@Component({
  selector: 'app-home',
  imports: [CommonModule, GallerySection,ServicesHightlights,BestSeller],
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
