import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:2028/auth/login';
  private userUrl = 'http://localhost:2028/users/filter/matricule/'; // URL correcte pour récupérer l'utilisateur

  constructor(private http: HttpClient) {}

  login(credentials: { matricule: string; motDePasse: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, credentials);
  }

  // Méthode pour récupérer l'utilisateur par matricule
  getUserInfoByMatricule(matricule: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}${matricule}`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

