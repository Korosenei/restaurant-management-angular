import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EMPLOYE } from '../../../models/model-users/employe.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private apiUrl = 'http://localhost:8080/api/employes';

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer toutes les Employes
  getEmployes(): Observable<EMPLOYE[]> {
    return this.http.get<EMPLOYE[]>(this.apiUrl);
  }

  // Méthode pour obtenir un Employe par son ID
  getEmploye(id: number): Observable<EMPLOYE> {
    return this.http.get<EMPLOYE>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour ajouter une EMPLOYE
  addEmploye(EMPLOYE: EMPLOYE): Observable<EMPLOYE> {
    return this.http.post<EMPLOYE>(this.apiUrl, EMPLOYE, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  // Méthode pour mettre à jour un Employe
  updateEmploye(id: number, EMPLOYE: EMPLOYE): Observable<EMPLOYE> {
    return this.http.put<EMPLOYE>(`${this.apiUrl}/${id}`, EMPLOYE, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  // Méthode pour supprimer un Employe
  deleteEmploye(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
