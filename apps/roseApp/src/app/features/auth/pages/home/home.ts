import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrustedBy } from "../../../Trusted by Section/components/trusted-by/trusted-by";
import { BestSeller } from '../best-seller/best-seller';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';


@Component({
  selector: 'app-home',
  imports: [CommonModule, GallerySection,BestSeller,TrustedBy],
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
