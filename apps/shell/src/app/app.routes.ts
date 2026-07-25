import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'roseApp',
    pathMatch: 'full',
  },
  {
    path: 'roseApp',
    loadChildren: () =>
      loadRemote<typeof import('roseApp/Routes')>('roseApp/Routes').then(
        (m) => (m ? m.remoteRoutes : []),
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemote<typeof import('authApp/Routes')>('authApp/Routes').then(
        (m) => (m ? m.remoteRoutes : []),
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      loadRemote<typeof import('adminDashboard/Routes')>(
        'adminDashboard/Routes',
      ).then((m) => (m ? m.remoteRoutes : [])),
  },

];
