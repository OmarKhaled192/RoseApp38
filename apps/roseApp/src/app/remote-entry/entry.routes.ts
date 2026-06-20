import { Route } from '@angular/router';
import { HomeComponent } from '../features/auth/pages/home/home';
import { RoseApp } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RoseApp,
    children: [
      { path: '', component: HomeComponent }
    ]
  }
];
