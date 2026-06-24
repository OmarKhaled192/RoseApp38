import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DarkModeComponent,
  LanguageSwitcherComponent,
  ToastMsg,
} from '@org/ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [
    FormsModule,
    CommonModule,
    DarkModeComponent,
    LanguageSwitcherComponent,
    ToastMsg,
    TranslatePipe,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  translate = inject(TranslateService);

  searchQuery = '';
  isArabic = true;
  mobileSearchOpen = false;
  userMenuOpen = false;
  userName = 'Jonathan Adrian'; // ✅ Add this

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
    this.router.navigateByUrl('/auth/login');
  }

  isLoggedIn(): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('token=');
  }

  onSignout(): void {
    if (typeof document !== 'undefined') {
      document.cookie =
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    this.userMenuOpen = false; // ✅ Close menu on signout
    this.router.navigateByUrl('/auth/login');
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

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  openLocationDropdown(): void {
    console.log('Open location dropdown');
  }
}
