import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@org/auth';
import {
  DarkModeComponent,
  LanguageSwitcherComponent
} from '@org/ui';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DarkModeComponent,
    LanguageSwitcherComponent,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private translate = inject(TranslateService);
  readonly authService = inject(AuthenticationService);
  firstName = this.authService.firstName;
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
    this.router.navigateByUrl('/auth/login');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSignout(): void {
    this.authService.removeToken();
    this.userMenuOpen = false;
    this.router.navigateByUrl('/auth/login');
  }

  onLanguageChanged(lang: string): void {
    this.translate.use(lang);
  }

  toggleLanguage(): void {
    this.isArabic = !this.isArabic;
  }

  // --- User menu (only relevant when logged in) ---
  userMenuOpen = false;

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.userMenuOpen) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-trigger')) {
      this.userMenuOpen = false;
    }
  }


  deliveryCity = signal<string>('Cairo');

  onChangeLocation(): void {
    console.log('Change delivery location clicked');

  }


  wishlistCount = signal<number>(0);
  cartCount = signal<number>(0);
  notificationCount = signal<number>(0);

  onLove(): void {
    this.router.navigateByUrl('/roseApp/wishlist');
  }

  onCart(): void {
    this.router.navigateByUrl('/roseApp/checkout/cart');
  }

  onNotifications(): void {
    console.log('Notifications clicked');
  }
}
