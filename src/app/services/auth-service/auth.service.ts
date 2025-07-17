import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { USER } from '../../models/model-users/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:2028/auth/login';
  private userUrl = 'http://localhost:2028/users/filter/matricule/';
  private userByIdUrl = 'http://localhost:2028/users/';
  private userForgotPwdUrl = 'http://localhost:2028/users/forgot-password';

  constructor(private http: HttpClient) {}


  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns boolean - true si authentifié, false sinon
   */
  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return this.isTokenValid(token);
  }

  /**
   * Récupère le token depuis localStorage ou sessionStorage
   * @returns string | null - le token ou null si non trouvé
   */
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Vérifie si le token est valide (non expiré)
   * @param token - le token à vérifier
   * @returns boolean - true si valide, false sinon
   */
  private isTokenValid(token: string): boolean {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp && tokenPayload.exp < now) {
        // Token expiré, le supprimer
        this.clearToken();
        return false;
      }

      return true;
    } catch (error) {
      // Token invalide, le supprimer
      this.clearToken();
      return false;
    }
  }

  /**
   * Authentifie un utilisateur et stocke le token et ses infos dans le localStorage.
   */
  login(credentials: { matricule: string; motDePasse: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);

        // Préchargement des infos utilisateur après login
        this.getUserInfoByMatricule(credentials.matricule).subscribe({
          next: (user) => {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userId', user.id.toString());
            localStorage.setItem('userRole', user.role);
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
          }
        });
      })
    );
  }

  /**
   * Récupère les informations utilisateur à partir de son matricule.
   */
  getUserInfoByMatricule(matricule: string): Observable<USER> {
    return this.http.get<USER>(`${this.userUrl}${matricule}`);
  }

  /**
   * Supprime le token du storage
   */
  private clearToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.clearToken();
  }

  /**
   * Demande de réinitialisation du mot de passe.
   */
  forgotPassword(credentials: { matricule: string; email: string }): Observable<any> {
    return this.http.post<any>(this.userForgotPwdUrl, credentials);
  }

  /**
   * Retourne le rôle de l'utilisateur courant.
   */
  getUserRole(): string {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Retourne l'ID de l'utilisateur courant.
   */
  getCurrentUserId(): number | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id ?? null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Récupère les informations utilisateur à partir de son ID.
   */
  getUserById(userId: number): Observable<USER> {
    return this.http.get<USER>(`${this.userByIdUrl}${userId}`);
  }
}
