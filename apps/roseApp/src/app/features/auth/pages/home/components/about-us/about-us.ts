import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  mainImage = 'assets/images/gift-box-main.jpg';
  topRightImage = 'assets/images/gift-confetti.jpg';
  bottomRightImage = 'assets/images/gift-balloons.jpg';
  features: string[] = [
    'Competitive Prices & Easy Shopping',
    'Premium Quality & Elegant Packaging',
    'Perfect for Every Occasion',
    'Fast & Reliable Delivery',
  ];
}
