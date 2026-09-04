import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const userData = authService.getUserData();

  if (!userData) {
    router.navigate(['auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    if (!userData.role || !requiredRoles.includes(userData.role)) {
      router.navigate(['auth/login']);
      return false;
    }
  }

  return true;
};
