import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule, GallerySection],
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
