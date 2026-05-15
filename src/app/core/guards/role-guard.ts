import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.navigate(['/auth']);
    return false;
  }

  try {

    const decoded: any = jwtDecode(token);

    const role =
      decoded.role ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    const allowedRoles = route.data?.['roles'] as string[];

    if (allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/']);

    return false;

  } catch {
    router.navigate(['/auth']);
    return false;
  }
};