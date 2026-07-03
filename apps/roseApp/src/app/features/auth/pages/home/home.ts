import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { BestSeller } from '../best-seller/best-seller';
import { MostPopular } from './components/most-popular/most-popular';
@Component({
  selector: 'app-home',
  imports: [CommonModule, MostPopular, GallerySection,BestSeller],
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
