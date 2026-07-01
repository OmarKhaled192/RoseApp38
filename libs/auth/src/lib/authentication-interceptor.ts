import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthenticationService);
  const token = authService.getToken();
    console.log('🔑 Interceptor fired:', token, req.url);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
