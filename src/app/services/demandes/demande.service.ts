import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DEMANDE } from 'src/app/views/composants/page-nouvel-element/new-demande/demande.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  demandeObj: DEMANDE = new DEMANDE();
  private getUrl = 'http://localhost:3000/demandes';
  private putUrl = `http://localhost:3000/demandes/${this.demandeObj.id}`;

  constructor(private http: HttpClient) {}

  addDemande(demande: DEMANDE): Observable<DEMANDE>{
    return this.http.post<DEMANDE>(this.getUrl, demande);
  }

  updateDemande(demande: DEMANDE): Observable<DEMANDE>{
    return this.http.put<DEMANDE>(this.putUrl, demande);
  }

  getDemandes(): Observable<DEMANDE[]> {
    return this.http.get<DEMANDE[]>(this.getUrl);
  }
}
