import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUs } from './components/about-us/about-us';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AboutUs],
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
