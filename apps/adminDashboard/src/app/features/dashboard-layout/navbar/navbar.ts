import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@org/auth';
import { DarkModeComponent, LanguageSwitcherComponent } from '@org/ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserAvatar } from '../shared/user-avatar/user-avatar';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    UserAvatar,
    DarkModeComponent,
    LanguageSwitcherComponent,
    TranslatePipe,
    Breadcrumb,
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly authService = inject(AuthenticationService);
  private readonly translate = inject(TranslateService);
  readonly router = inject(Router);

  firstName = this.authService.getUserData()?.firstName || '';
  lastName = this.authService.getUserData()?.lastName || '';
  email = this.authService.getUserData()?.email || '';
  photo = this.authService.getUserData()?.photo || '';

  @Output() mobileMenuToggle = new EventEmitter<void>();

  menuOpen = false;

  onLanguageChanged(lang: string): void {
    this.translate.use(lang);
  }

  toggleMobileMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    this.mobileMenuToggle.emit();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  goToAccount(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.removeToken();
    this.menuOpen = false;
    this.router.navigateByUrl('/auth/login');
  }
}