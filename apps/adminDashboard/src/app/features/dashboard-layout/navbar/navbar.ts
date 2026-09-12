import { CommonModule } from '@angular/common';
import { AdminAccountStore } from '../../account/state/account.store';
import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';
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
  readonly accountStore = inject(AdminAccountStore);
  private readonly translate = inject(TranslateService);
  readonly router = inject(Router);

  get firstName() {
    return this.accountStore.user()?.firstName ?? '';
  }
  get lastName() {
    return this.accountStore.user()?.lastName ?? '';
  }
  get email() {
    return this.accountStore.user()?.email ?? '';
  }
  get photo() {
    return this.accountStore.user()?.photo ?? '';
  }

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
    void this.router.navigateByUrl('/admin/account/profile');
  }

  logout(): void {
    this.authService.removeToken();
    this.menuOpen = false;
    this.router.navigateByUrl('/auth/login');
  }
}
