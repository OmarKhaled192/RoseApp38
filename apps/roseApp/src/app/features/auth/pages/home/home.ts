import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrustedBy } from "../../../Trusted by Section/components/trusted-by/trusted-by";

@Component({
  selector: 'app-home',
  imports: [CommonModule, TrustedBy],
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
