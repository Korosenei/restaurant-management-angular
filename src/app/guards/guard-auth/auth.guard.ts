import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Vérifier si l'utilisateur est authentifié
  if (!authService.isAuthenticated()) {
    // Rediriger vers 404 au lieu de login
    router.navigate(['/404']);
    return false;
  }

  return true;
};
