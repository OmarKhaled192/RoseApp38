import { Route } from '@angular/router';
import { Layout } from './features/auth/pages/layout/layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Layout,
    children: [],
  },
];
