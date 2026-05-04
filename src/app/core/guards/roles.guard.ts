import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const currentRole  = auth.currentRole();
  const allowedRoles = route.data['roles'] as string[] | undefined;

  // Not logged in at all
  if (!auth.isLoggedIn() || currentRole === null) {
    router.navigate(['/login']);
    return false;
  }

  // No role restriction on this route — allow through
  if (!allowedRoles || allowedRoles.length === 0) return true;

  // Check role is in allowed list
  if (allowedRoles.includes(currentRole)) return true;

  // Logged in but wrong role
  router.navigate(['/unauthorized']);
  return false;
};