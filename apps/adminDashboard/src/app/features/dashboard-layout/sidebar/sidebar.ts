import { CommonModule } from '@angular/common';
import { AdminAccountStore } from '../../account/state/account.store';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '@org/auth';
import { TranslatePipe } from '@ngx-translate/core';
import { UserAvatar } from '../shared/user-avatar/user-avatar';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLinkActive,
    RouterLink,
    CommonModule,
    UserAvatar,
    TranslatePipe,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  router = inject(Router);
  menuOpen = false;

  readonly authService = inject(AuthenticationService);
  readonly accountStore = inject(AdminAccountStore);
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

  constructor(private elementRef: ElementRef) {}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  goToAccount(): void {
    this.menuOpen = false;
    this.router.navigate(['/admin/account/profile']);
  }

  logout(): void {
    this.authService.removeToken();
    this.menuOpen = false;
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
}
