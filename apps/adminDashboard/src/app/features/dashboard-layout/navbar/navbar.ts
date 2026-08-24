import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter } from 'rxjs';
import { AppUser } from '../interface/user';
import { UserAvatar } from "../shared/user-avatar/user-avatar";

export interface NavbarUser {
  name: string;
  email: string;
  photoUrl?: string | null;
}
@Component({
  selector: 'app-navbar',
  imports: [BreadcrumbModule, CommonModule, UserAvatar],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {


  user: AppUser | null = {
    name: 'Obaid Ramadan',
    email: 'ObaidRamadan@gmail.com',
    photoUrl: null
  };


  @Output() mobileMenuToggle = new EventEmitter<void>();

  items: MenuItem[] = [];
  menuOpen = false;


  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
  
    this.updateBreadcrumb();

   
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });
  }

  private updateBreadcrumb(): void {

    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const breadcrumb = route.snapshot.data['breadcrumb'];

    if (breadcrumb) {
      this.items = [
        {
          label: 'Dashboard',
          routerLink: '/dashboard'
        },
        {
          label: breadcrumb
        }
      ];
    } else {
      this.items = [
        {
          label: 'Dashboard',
          routerLink: '/dashboard'
        }
      ];
    }
  }

  toggleMobileMenu(event: Event): void {
    
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    this.mobileMenuToggle.emit();
  }

  goToAccount() {
    console.log("dsds");

  }

  logout() {
    // console.log('dddd');
  }

}