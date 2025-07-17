import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MENU } from '../../../models/model-restos/menu.model';
import { AuthService } from '../../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly API_BASE_URL = 'http://localhost:2026/menus';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
   * Créer un nouveau menu
   */
  create(menuData: any): Observable<MENU> {
    const headers = this.getAuthHeaders();
    return this.http.post<MENU>(`${this.API_BASE_URL}/create`, menuData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Mettre à jour un menu existant
   */
  update(id: number, menuData: any): Observable<MENU> {
    const headers = this.getAuthHeaders();
    return this.http.put<MENU>(`${this.API_BASE_URL}/update/${id}`, menuData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer un menu par ID
   */
  findById(id: number): Observable<MENU> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU>(`${this.API_BASE_URL}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer tous les menus d'un restaurant
   */
  findByRestaurant(restaurantId: number): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/restaurant/${restaurantId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer tous les menus créés par un manager
   */
  findByManager(managerId: number): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/manager/${managerId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer tous les menus
   */
  findAll(): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/all`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Supprimer un menu (suppression logique)
   */
  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.API_BASE_URL}/delete/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Uploader une image pour un menu
   */
  uploadImage(menuId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const headers = this.getFileUploadHeaders();
    return this.http.post(`${this.API_BASE_URL}/${menuId}/upload-image`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus par date
   */
  findByDate(date: string): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/date/${date}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus disponibles
   */
  findAvailable(): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/available`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus par restaurant et date
   */
  findByRestaurantAndDate(restaurantId: number, date: string): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/restaurant/${restaurantId}/date/${date}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus d'une semaine spécifique
   */
  findByWeek(weekNumber: number, year: number): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/week/${weekNumber}/year/${year}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus d'une semaine pour un restaurant spécifique
   */
  findByRestaurantAndWeek(restaurantId: number, weekNumber: number, year: number): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/restaurant/${restaurantId}/week/${weekNumber}/year/${year}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Changer la disponibilité d'un menu
   */
  toggleAvailability(id: number): Observable<MENU> {
    const headers = this.getAuthHeaders();
    return this.http.patch<MENU>(`${this.API_BASE_URL}/${id}/toggle-availability`, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Dupliquer un menu pour une autre date
   */
  duplicate(id: number, newDate: string): Observable<MENU> {
    const headers = this.getAuthHeaders();
    const body = { newDate };
    return this.http.post<MENU>(`${this.API_BASE_URL}/${id}/duplicate`, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Rechercher des menus par nom
   */
  searchByName(name: string): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/search?name=${encodeURIComponent(name)}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les statistiques des menus
   */
  getStatistics(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.API_BASE_URL}/statistics`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupérer les menus populaires
   */
  getPopularMenus(limit: number = 10): Observable<MENU[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MENU[]>(`${this.API_BASE_URL}/popular?limit=${limit}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Valider les données du menu avant envoi
   */
  validateMenuData(menuData: any): string[] {
    const errors: string[] = [];

    if (!menuData.nom || menuData.nom.trim().length < 2) {
      errors.push('Le nom du menu doit contenir au moins 2 caractères');
    }

    if (!menuData.description || menuData.description.trim().length < 4) {
      errors.push('La description doit contenir au moins 4 caractères');
    }

    if (!menuData.quantite || menuData.quantite < 1) {
      errors.push('La quantité doit être supérieure à 0');
    }

    if (!menuData.dateJour) {
      errors.push('La date du menu est obligatoire');
    }

    if (!menuData.creerPar || !menuData.creerPar.id) {
      errors.push('L\'utilisateur créateur est requis');
    }

    return errors;
  }

  /**
   * Formatter les données du menu pour l'envoi à l'API
   */
  formatMenuData(formValue: any, currentUser: any, userRestaurant: any): any {
    return {
      nom: formValue.nom?.trim(),
      description: formValue.description?.trim(),
      quantite: Number(formValue.quantite),
      isDisponible: Boolean(formValue.isDisponible),
      dateJour: formValue.dateJour,
      image: formValue.image || null,

      restaurantDto: userRestaurant ? {
        id: userRestaurant.id,
        nom: userRestaurant.nom,
        ville: userRestaurant.ville,
        telephone: userRestaurant.telephone
      } : null,

      creerPar: {
        id: currentUser.id,
        matricule: currentUser.matricule,
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        email: currentUser.email,
        role: currentUser.role
      },

      creationDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      isDeleted: false
    };
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Erreur MenuService:', error);

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
