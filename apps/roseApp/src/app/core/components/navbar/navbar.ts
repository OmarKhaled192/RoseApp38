import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DarkModeComponent, LanguageSwitcherComponent } from '@org/ui';
import { AuthenticationService } from '@org/auth';
@Component({
  selector: 'app-navbar',
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
  private translate = inject(TranslateService)
  readonly authService = inject(AuthenticationService);

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
    this.router.navigateByUrl('/auth/login');
  }
  onLanguageChanged(lang: string): void {
    this.translate.use(lang);
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
