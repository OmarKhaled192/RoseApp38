import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { BestSeller } from './components/best-seller/best-seller';

@Component({
  selector: 'app-home',
  imports: [CommonModule, GallerySection,BestSeller],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  title = 'Home';
}
