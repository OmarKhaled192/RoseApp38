import { Route } from '@angular/router';
import { HomeComponent } from '../features/home/home';
import { RoseApp } from './entry';
import { CartComponent } from '../features/checkout/pages/checkout/cart/cart';
import { Layout } from '../features/layout/layout';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('../features/wishlist/pages/wish-list/wish-list').then(
            (m) => m.WishList,
          ),
      },
  
      {
        path: 'orders',
        loadComponent: () =>
          import('../features/orders-list/orders-list').then(
            (m) => m.OrdersList,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../features/products/products').then((m) => m.Products),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../features/product/pages/product-details/product-details').then(
            (m) => m.ProductDetails,
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../features/checkout/pages/checkout/checkout').then(
            (m) => m.Checkout,
          ),
        children: [
          { path: '', redirectTo: 'cart', pathMatch: 'full' },

          {
            path: 'cart',
            loadComponent: () =>
              import('../features/checkout/pages/checkout/cart/cart').then(
                (m) => m.CartComponent,
              ),
          },
          {
            path: 'payment',
            loadComponent: () =>
              import('../features/checkout/pages/checkout/payment-method/payment-method').then(
                (m) => m.PymentMethod,
              ),
          },

          {
            path: 'address',
            loadComponent: () =>
              import('../features/checkout/pages/checkout/addresses/components/checkout-address/checkout-address.component').then(
                (m) => m.CheckoutAddressComponent,
              ),
          },
        ],
      },
      {
        path: 'setting',
        loadComponent: () =>
          import('../features/setting/pages/setting').then(
            (m) => m.Setting,
          ),
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },

          {
            path: 'profile',
            loadComponent: () =>
              import('../features/setting/pages/profile/profile').then(
                (m) => m.Profile,
              ),
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import('../features/setting/pages/change-password/change-password').then(
                (m) => m.ChangePassword,
              ),
          },
        ],
      },
    ],
  },
];
