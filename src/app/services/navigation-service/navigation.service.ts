import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly publicRoutes: string[] = ['/login', '/recover', '/404', '/500'];
  private readonly protectedRoutes: string[] = ['/dashboard', '/elements', '/restos', '/users', '/structures', '/parametres', '/activate'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.initializeNavigationGuard();
  }

  private initializeNavigationGuard(): void {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.checkRouteAccess(event.url);
      });
  }

  private checkRouteAccess(url: string): void {
    // Vérifier si c'est une route protégée
    const isProtectedRoute = this.protectedRoutes.some(route => url.startsWith(route));

    if (isProtectedRoute && !this.authService.isAuthenticated()) {
      // Rediriger vers 404 si l'utilisateur n'est pas authentifié
      this.router.navigate(['/404']);
    }
  }

  /**
   * Méthode pour naviguer de manière sécurisée
   * @param route - la route de destination
   */
  navigateSecurely(route: string): void {
    const isProtectedRoute = this.protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));

    if (isProtectedRoute && !this.authService.isAuthenticated()) {
      this.router.navigate(['/404']);
    } else {
      this.router.navigate([route]);
    }
  }

  /**
   * Vérifie si une route est accessible pour l'utilisateur actuel
   * @param route - la route à vérifier
   * @returns boolean - true si accessible, false sinon
   */
  isRouteAccessible(route: string): boolean {
    const isProtectedRoute = this.protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));

    if (isProtectedRoute) {
      return this.authService.isAuthenticated();
    }

    return true;
  }

  /**
   * Obtient la route de redirection appropriée pour un utilisateur non authentifié
   * @returns string - la route de redirection
   */
  getRedirectRoute(): string {
    return '/404';
  }
}
