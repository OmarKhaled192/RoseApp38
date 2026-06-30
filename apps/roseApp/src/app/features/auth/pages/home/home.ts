import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesHightlights } from "../../../services-highlights/component/servicesHightlights";

@Component({
  selector: 'app-home',
  imports: [CommonModule, ServicesHightlights],
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
