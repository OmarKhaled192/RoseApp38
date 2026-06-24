import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
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
          import('./register-email/register-email').then((m) => m.RegisterEmail),
      },
      {
        path: 'register-details',
        loadComponent: () =>
          import('./register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'forget-password',
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
];
