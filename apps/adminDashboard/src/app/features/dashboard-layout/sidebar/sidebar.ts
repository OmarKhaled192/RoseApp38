import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppUser } from '../interface/user';
import { UserAvatar } from "../shared/user-avatar/user-avatar";
import { AuthenticationService } from '@org/auth';



@Component({
  selector: 'app-sidebar',
  imports: [RouterLinkActive, RouterLink, CommonModule, UserAvatar],
  templateUrl: './sidebar.html',

})
export class Sidebar {

  router = inject(Router)
  menuOpen = false;

  readonly authService = inject(AuthenticationService);
  firstName = this.authService.getUserData()?.firstName || '';
  lastName = this.authService.getUserData()?.lastName || '';
  email = this.authService.getUserData()?.email || '';
  photo = this.authService.getUserData()?.photo || '';


  constructor(private elementRef: ElementRef) { }

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

  }

  logout(): void {
    this.menuOpen = false;
    sessionStorage.clear();
    localStorage.clear();

    this.router.navigate(['/login'])

  }

}