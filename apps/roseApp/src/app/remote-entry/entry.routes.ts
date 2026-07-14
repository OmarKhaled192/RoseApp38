import { Route } from '@angular/router';
import { HomeComponent } from '../features/home/home';
import { RoseApp } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RoseApp,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'products',
        loadComponent: () =>
          import('../features/products/products').then(
            (m) => m.Products
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../features/product/pages/product-details/product-details').then(
            (m) => m.ProductDetails
          ),
      },
    ]
  },
];
