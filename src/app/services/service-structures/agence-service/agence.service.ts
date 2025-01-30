import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AGENCE } from '../../../models/model-structures/agence.model';
import { DIRECTION } from '../../../models/model-structures/direction.model';
import { EMPLOYE } from '../../../models/model-users/employe.model';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private readonly BASE_URL = 'http://localhost:2020/agence-management-service';

  constructor(private http: HttpClient) {}

  getAllAgences(): Observable<AGENCE[]> {
    return this.http.get<AGENCE[]>(`${this.BASE_URL}/agences/all`);
  }

  getAgenceById(id: number): Observable<AGENCE> {
    return this.http.get<AGENCE>(`${this.BASE_URL}/agences/${id}`);
  }

  saveAgence(agence: AGENCE): Observable<AGENCE> {
    return this.http.post<AGENCE>(`${this.BASE_URL}/agences`, agence);
  }

  updateAgence(id: number, agence: AGENCE): Observable<AGENCE> {
    return this.http.put<AGENCE>(`${this.BASE_URL}/agences/${id}`, agence);
  }

  // Gestion des directions
  getAllDirections(): Observable<DIRECTION[]> {
    return this.http.get<DIRECTION[]>(`${this.BASE_URL}/directions/all`);
  }

  // Gestion des employés
  getAllEmployes(): Observable<EMPLOYE[]> {
    return this.http.get<EMPLOYE[]>(`${this.BASE_URL}/employes`);
  }
}
