import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DarkModeComponent, LanguageSwitcherComponent, ProductData } from '@org/ui';
import { AuthenticationService } from '@org/auth';
import { SearchProducts } from '../search-products/search-products';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TranslatePipe,
    DarkModeComponent,
    LanguageSwitcherComponent,
    RouterLink,
    RouterModule,
    SearchProducts,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private translate = inject(TranslateService);
  readonly authService = inject(AuthenticationService);

  searchQuery = '';
  searchResults: ProductData[] = [];
  searchLoading = false;
  isArabic = true;
  showSearchDropdown = false;

  mobileSearchOpen = false;
  toggleMobileSearch(): void {
    this.mobileSearchOpen = !this.mobileSearchOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/roseApp/search'], {
        queryParams: { q: this.searchQuery },
      });
      this.closeSearchDropdown();
      this.mobileSearchOpen = false;
    }
  }

  onSearchInputChange(value: string): void {
    this.searchQuery = value;
    this.showSearchDropdown = this.searchQuery.trim().length > 0;
  }

  onSearchFocus(): void {
    this.showSearchDropdown = this.searchQuery.trim().length > 0;
  }

  closeSearchDropdown(): void {
    this.showSearchDropdown = false;
  }

  onSearchResultSelected(): void {
    this.searchQuery = '';
    this.closeSearchDropdown();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-search-container')) {
      this.closeSearchDropdown();
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
