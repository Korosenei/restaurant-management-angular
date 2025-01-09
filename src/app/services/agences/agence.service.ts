import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AGENCE } from 'src/app/views/composants/page-nouvel-service/new-agence/agence.model';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  agenceObj: AGENCE = new AGENCE();
  private getUrl = 'http://localhost:3000/agences';
  private putUrl = `http://localhost:3000/agences/${this.agenceObj.id}`;

  constructor(private http: HttpClient) {}

  addAgence(agence: AGENCE): Observable<AGENCE>{
    return this.http.post<AGENCE>(this.getUrl, agence);
  }

  updateAgence(agence: AGENCE): Observable<AGENCE>{
    return this.http.put<AGENCE>(this.putUrl, agence);
  }

  getAgences(): Observable<AGENCE[]> {
    return this.http.get<AGENCE[]>(this.getUrl);
  }
}
