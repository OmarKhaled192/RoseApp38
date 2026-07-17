import { Wishlist } from './../features/product/models/wishlist';
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
        path: 'wishlist',
        loadComponent: () =>
          import('../features/wishlist/pages/wish-list/wish-list').then(
            (m) => m.WishList,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../features/products/products').then(
            (m) => m.Products,
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../features/product/pages/product-details/product-details').then(
            (m) => m.ProductDetails,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../features/checkout/pages/checkout/cart/cart').then(
            (m) => m.CartComponent
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../features/checkout/pages/checkout/checkout').then(
            (m) => m.Checkout
          ),
        children: [
          {
            path: 'cart',
            loadComponent: () =>
              import('../features/checkout/pages/checkout/cart/cart').then(
                (m) => m.CartComponent
              ),
          },
        ],
      },
    ],
  },
];
