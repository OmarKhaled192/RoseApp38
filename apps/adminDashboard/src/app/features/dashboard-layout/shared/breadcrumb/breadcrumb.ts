import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TranslateService } from '@ngx-translate/core';

interface RouteBreadcrumbInfo {
  key: string;
  defaultLabel: string;
}

const SIDEBAR_ROUTE_MAP: Record<string, RouteBreadcrumbInfo> = {
  overview: { key: 'dashboard.breadcrumb.overview', defaultLabel: 'Overview' },
  categories: { key: 'dashboard.breadcrumb.categories', defaultLabel: 'Categories' },
  occasions: { key: 'dashboard.breadcrumb.occasions', defaultLabel: 'Occasions' },
  products: { key: 'dashboard.breadcrumb.products', defaultLabel: 'Products' },
  preview: { key: 'dashboard.breadcrumb.preview', defaultLabel: 'Preview Website' },
};

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  items: MenuItem[] = [];

  ngOnInit(): void {
    this.updateBreadcrumb();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });

    this.translate.onLangChange.subscribe(() => {
      this.updateBreadcrumb();
    });
  }

  updateBreadcrumb(): void {
    const dashboardLabel = this.getTranslatedString(
      'dashboard.breadcrumb.dashboard',
      'Dashboard'
    );

    let currentRoute: ActivatedRoute | null = this.activatedRoute;
    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const routeBreadcrumb = currentRoute?.snapshot.data?.['breadcrumb'];

    const currentUrl = (this.router.url || '').split('?')[0].split('#')[0];
    const urlSegments = currentUrl
      .split('/')
      .filter((segment) => segment && segment !== 'admin' && segment !== 'dashboard');

    const lastSegment = urlSegments[urlSegments.length - 1]?.toLowerCase();

    let pageLabel: string | null = null;

    if (routeBreadcrumb) {
      const routeKey = `dashboard.breadcrumb.${routeBreadcrumb.toLowerCase()}`;
      pageLabel = this.getTranslatedString(routeKey, routeBreadcrumb);
    } else if (lastSegment && SIDEBAR_ROUTE_MAP[lastSegment]) {
      const info = SIDEBAR_ROUTE_MAP[lastSegment];
      pageLabel = this.getTranslatedString(info.key, info.defaultLabel);
    } else if (lastSegment) {
      pageLabel = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }

    if (pageLabel && lastSegment !== 'overview') {
      this.items = [
        {
          label: dashboardLabel,
          routerLink: '/admin/overview',
        },
        {
          label: pageLabel,
        },
      ];
    } else if (lastSegment === 'overview') {
      const overviewLabel = this.getTranslatedString(
        'dashboard.breadcrumb.overview',
        'Overview'
      );
      this.items = [
        {
          label: dashboardLabel,
          routerLink: '/admin/overview',
        },
        {
          label: overviewLabel,
        },
      ];
    } else {
      this.items = [
        {
          label: dashboardLabel,
          routerLink: '/admin/overview',
        },
      ];
    }
  }

  private getTranslatedString(key: string, defaultVal: string): string {
    const translated = this.translate.instant(key);
    return translated && translated !== key ? translated : defaultVal;
  }
}