import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';
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
];
