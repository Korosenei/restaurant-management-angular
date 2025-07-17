import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';

export const menuGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  if (!authService.isAuthenticated()) {
    console.warn('Accès refusé: Utilisateur non authentifié');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  // Vérifier le rôle de l'utilisateur
  const userRole = authService.getUserRole();
  const allowedRoles = ['ADMIN', 'MANAGER'];
  
  if (!allowedRoles.includes(userRole)) {
    console.warn(`Accès refusé: Rôle ${userRole} non autorisé pour la création de menu`);
    
    // Rediriger vers une page d'erreur ou le dashboard
    router.navigate(['/unauthorized'], {
      queryParams: { 
        message: 'Seuls les administrateurs et managers peuvent créer des menus',
        requiredRoles: allowedRoles.join(', ')
      }
    });
    return false;
  }

  // Vérifications supplémentaires pour les managers
  if (userRole === 'MANAGER') {
    const userId = authService.getCurrentUserId();
    if (!userId) {
      console.warn('Accès refusé: ID utilisateur manquant');
      router.navigate(['/login']);
      return false;
    }
    
    // Note: Ici vous pourriez ajouter une vérification asynchrone
    // pour vérifier si le manager a un restaurant associé
    // Mais pour un guard synchrone, on fait la vérification dans le composant
  }

  console.log(`Accès autorisé pour l'utilisateur avec le rôle: ${userRole}`);
  return true;
};
