import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DarkModeComponent, LanguageSwitcherComponent, ToastMsg } from '@org/ui';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule, DarkModeComponent, LanguageSwitcherComponent, ToastMsg],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = '';
  isArabic = true;

  mobileSearchOpen = false;
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
