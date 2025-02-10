import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface LoginRequest {
  matricule: string;
  motDePasse: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL du backend
  private apiUrl = 'http://localhost:2020/user-management-service';

  // La clé dans le localStorage pour stocker le token
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  // Méthode pour se connecter et obtenir le token
    login(credentials: LoginRequest): Observable<{ token: string }> {
      return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials);
    }

  // Sauvegarder le token dans le localStorage
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  // Supprimer le token (déconnexion)
  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
