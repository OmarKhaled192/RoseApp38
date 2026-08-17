import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'roseApp',
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    redirectTo: 'roseApp',
    pathMatch: 'full',
  },
];