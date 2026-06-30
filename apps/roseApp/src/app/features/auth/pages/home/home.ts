import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card, CardAction } from '@org/ui';
import { Check } from '@primeicons/angular/check';
@Component({
  selector: 'app-home',
  imports: [CommonModule, Card,Check],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  title = 'Home';
   hoverActions = signal<CardAction[]>([
    {
      label: 'View',
      icon: 'check',
      action: () => {
        console.log('View action clicked');
      }
    },
  ]);
  card: any = {
    title: 'iPhone 15',
    description: 'Apple smartphone',
    price: 999,
    rating: 5,
    image: 'https://picsum.photos/300',
    badge: 'new'
  };

  welcomeMessage = 'Welcome To Home';

  constructor() {
    console.log('Home Component Initialized');
  }
}
