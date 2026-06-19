import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../shared/components/auth-layout/auth-layout.component').then(
            (m) => m.AuthLayoutComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
          },
          {
            path: 'login',
            loadComponent: () =>
              import('./login/login.component').then((m) => m.LoginComponent),
          },

          {
            path: 'register',
            loadComponent: () =>
              import('./register/register.component').then((m) => m.RegisterComponent),
          },
          {
            path: 'forgot-password',
            loadComponent: () =>
              import('./forget-password/components/forget-password/forget-password.component').then(
                (m) => m.ForgetPasswordComponent
              ),
          },
          {
            path: 'otp-code',
            loadComponent: () =>
              import('./otp-code/otp-code.component').then(
                (m) => m.OtpCodeComponent
              ),
          },
          {
            path: 'reset-password',
            loadComponent: () =>
              import('./reset-password/components/reset-password/reset-password.component').then(
                (m) => m.ResetPasswordComponent
              ),
          },
        ],
      },
    ],
  },
];
