import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RESTAURANT } from '../../../models/model-restos/restaurant.model';
import { AuthService } from '../../auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly API_BASE_URL = 'http://localhost:2026/restos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtenir les headers d'authentification
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

    /**
     * Obtenir les headers pour l'upload de fichiers
     */
    private getFileUploadHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
        // Ne pas définir Content-Type pour les FormData
      });
    }

    /**
     * Créer un nouveau restaurant
     */
    create(restoData: any): Observable<RESTAURANT> {
      const headers = this.getAuthHeaders();
      return this.http.post<RESTAURANT>(`${this.API_BASE_URL}/create`, restoData, { headers })
        .pipe(
          catchError(this.handleError)
        );
    }

    /**
     * Mettre à jour un restaurant existant
     */
    update(id: number, restoData: any): Observable<RESTAURANT> {
      const headers = this.getAuthHeaders();
      return this.http.put<RESTAURANT>(`${this.API_BASE_URL}/update/${id}`, restoData, { headers })
        .pipe(
          catchError(this.handleError)
        );
    }

    /**
     * Récupérer un restaurant par ID
     */
    findById(id: number): Observable<RESTAURANT> {
      const headers = this.getAuthHeaders();
      return this.http.get<RESTAURANT>(`${this.API_BASE_URL}/${id}`, { headers })
        .pipe(
          catchError(this.handleError)
        );
    }

  /**
   * Récupère le restaurant associé à un manager
   * @param managerId L'ID du manager
   */
  getRestaurantByManager(managerId: number): Observable<RESTAURANT> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<RESTAURANT>(`${this.API_BASE_URL}/manager/${managerId}`, {
        headers,
      })
        .pipe(
          catchError(this.handleError)
        );
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Erreur RestoService:', error);

    let errorMessage = 'Une erreur est survenue';

    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors) {
        errorMessage = Array.isArray(error.error.errors)
          ? error.error.errors.join(', ')
          : Object.values(error.error.errors).join(', ');
      }
    }

    switch (error.status) {
      case 400:
        errorMessage = 'Données invalides: ' + errorMessage;
        break;
      case 401:
        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
        break;
      case 403:
        errorMessage = 'Accès refusé. Permissions insuffisantes.';
        break;
      case 404:
        errorMessage = 'Ressource non trouvée.';
        break;
      case 409:
        errorMessage = 'Conflit: ' + errorMessage;
        break;
      case 500:
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        break;
      default:
        if (error.message) {
          errorMessage = error.message;
        }
    }

    return throwError(() => new Error(errorMessage));
  };
}
