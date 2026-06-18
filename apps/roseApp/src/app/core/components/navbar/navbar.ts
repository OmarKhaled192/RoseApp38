import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery: string = '';
  isArabic: boolean = true;
  mobileSearchOpen: boolean = false;

  toggleMobileSearch(): void {
    this.mobileSearchOpen = !this.mobileSearchOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      this.mobileSearchOpen = false;
    }
  }

  onLogin(): void {
    console.log('Login clicked');
  }

  onLove(): void {
    console.log('Wishlist clicked');
  }

  onCart(): void {
    console.log('Cart clicked');
  }

  onNotifications(): void {
    console.log('Notifications clicked');
  }

  toggleLanguage(): void {
    this.isArabic = !this.isArabic;
  }
}
