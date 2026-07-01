import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GallerySection } from '../../../sections/components/gallery-section/gallery-section';
import { Card, CardAction } from '@org/ui';
import { Check } from '@primeicons/angular/check';
import { MostPopular } from './components/most-popular/most-popular';
@Component({
  selector: 'app-home',
  imports: [CommonModule, Card, Check, MostPopular, GallerySection],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  title = 'Home';
  hoverActions = signal<CardAction[]>([
    {
      label: 'View',
      icon: 'check',
      variant: 'primary',
      action: () => {
        console.log('View action clicked');
      },
    },
  ]);
  card: any = {
    title: 'iPhone 15',
    description: 'Apple smartphone',
    price: 999,
    rating: 4.1,
    image: 'https://picsum.photos/300',
    badge: 'new',
  };

  welcomeMessage = 'Welcome To Home';

  constructor() {
    console.log('Home Component Initialized');
  }
}
