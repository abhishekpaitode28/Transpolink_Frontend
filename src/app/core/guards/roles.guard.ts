import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { routes } from "../../app.routes";
import { inject } from "@angular/core";
import { AuthService } from "../auth/auth.service";

export const roleGuard : CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const allowedRoles = route.data['roles'] as string[];
    const currentRole = auth.currentRole();

  if (!auth.isLoggedIn() || currentRole === null) {
    router.navigate(['/login']);
    return false;
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

    return true;
}