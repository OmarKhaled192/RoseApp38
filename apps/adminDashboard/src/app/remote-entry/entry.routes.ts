import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';
import { CategoriesList } from '../features/categories/pages/categories-list/categories-list';
import { CategoryForm } from '../features/categories/components/category-form/category-form';
import { NotFoundPage } from '../features/error-pages/not-found-page/not-found-page';
import { ServerErrorPage } from '../features/error-pages/server-error-page/server-error-page';
import { UnauthorizedPage } from '../features/error-pages/unauthorized-page/unauthorized-page';
import { authGuard } from '@org/auth';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard, pathMatch: 'full' },
      { path: 'account', pathMatch: 'full', redirectTo: 'account/profile' },
      {
        path: 'account/profile',
        loadComponent: () =>
          import('../features/account/pages/profile/profile').then(
            (m) => m.AdminProfile,
          ),
      },
      {
        path: 'account/change-password',
        loadComponent: () =>
          import('../features/account/pages/change-password/change-password').then(
            (m) => m.AdminChangePassword,
          ),
      },
    ],
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
    path: 'unauthorized',
    component: UnauthorizedPage
  },
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: Dashboard,
        pathMatch: 'full'
      },

      // Categories
      {
        path: 'categories',
        component: CategoriesList
      },
      {
        path: 'categories/add',
        component: CategoryForm
      },
      {
        path: 'categories/edit/:id',
        component: CategoryForm
      },

      // Products
      {
        path: 'product',
        loadComponent: () =>
          import('../features/product/component/product/product-list/product-list')
            .then((m) => m.ProductList),
        data: { breadcrumbKey: 'breadcrumb.productList' }
      },
            {
                path: 'occasions',
                loadComponent: () =>
                    import('../features/occasions/components/occasion-list/occasions-list').then((m) => m.OccasionsList),
            },
            {
                path: 'occasions/add',
                loadComponent: () =>
                    import('../features/occasions/components/occasion-form/occasion-form').then((m) => m.OccasionForm),
                data: { mode: 'add', breadcrumb: 'add Occasion', breadcrumbParent: 'occasions' },
            },
            {
                path: 'occasions/edit/:id',
                loadComponent: () =>
                    import('../features/occasions/components/occasion-form/occasion-form').then((m) => m.OccasionForm),
                data: { mode: 'edit', breadcrumb: 'editOccasion', breadcrumbParent: 'occasions' },
            },
      {
        path: 'product/add',
        loadComponent: () =>
          import('../features/product/component/product/product')
            .then((m) => m.Product),
        data: { breadcrumbKey: 'breadcrumb.addProduct' }
      },
      {
        path: 'product/edit/:id',
        loadComponent: () =>
          import('../features/product/component/product/product')
            .then((m) => m.Product),
        data: { breadcrumbKey: 'breadcrumb.editProduct' }
      },

      // Error pages
      {
        path: '404',
        component: NotFoundPage
      },
      {
        path: '500',
        component: ServerErrorPage
      },
      {
        path: '**',
        component: NotFoundPage
      }
    ],
    canActivate: [authGuard],
    data: {
      roles: ['ADMIN'],
      unauthorizedUrl: '/admin/unauthorized'
    },  }
];
