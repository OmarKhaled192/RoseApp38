import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppUser } from '../interface/user';
import { UserAvatar } from "../shared/user-avatar/user-avatar";



@Component({
  selector: 'app-sidebar',
  imports: [RouterLinkActive, RouterLink, CommonModule, UserAvatar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  router = inject(Router)
  menuOpen = false;
  user: AppUser | null = {
    name: 'Obaid Ramadan',
    email: 'ObaidRamadan@gmail.com',
    photoUrl: null
  };

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