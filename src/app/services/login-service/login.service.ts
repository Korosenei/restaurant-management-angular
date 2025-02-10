import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginRequest {
  matricule: string;
  motDePasse: string;
}

interface RegisterRequest {
  matricule: string;
  motDePasse: string;
  email: string;
  nom: string;
  prenom: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // URL du backend
  private apiUrl = 'http://localhost:2020/user-management-service';

  constructor(private http: HttpClient) { }

  // Méthode pour se connecter et obtenir le token
  login(credentials: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials);
  }

  // Méthode pour s'enregistrer (création d'un compte)
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create`, userData);
  }
}
