import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:2028/auth/login';
  private userUrl = 'http://localhost:2028/users/filter/matricule/';
  private userForgotPwdUrl = 'http://localhost:2028/users/forgot-password';

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

  // Méthode pour demander la récupération du mot de passe
  forgotPassword(credentials: { matricule: string; email: string }): Observable<any> {
    return this.http.post<any>(this.userForgotPwdUrl, credentials);
  }

  getUserRole(): string {
  const user = JSON.parse(localStorage.getItem('user')!);
  return user?.role || '';
}
}

