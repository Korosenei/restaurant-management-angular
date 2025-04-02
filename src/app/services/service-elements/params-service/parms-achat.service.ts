import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PARAMSACHAT } from '../../../models/model-elements/paramsAchat.model';

@Injectable({
  providedIn: 'root'
})
export class ParmsAchatService {

  private BASE_ACHAT_PARAMETRE_URL = 'http://localhost:2027/config'; // URL de l'API
  private CREATE_ACHAT_PARAMETRE_URL = this.BASE_ACHAT_PARAMETRE_URL + '/create';
  private FIND_ALL_ACHAT_PARAMETRE_URL = this.BASE_ACHAT_PARAMETRE_URL + '/all';

  constructor(private http: HttpClient) { }

  getParametres(): Observable<PARAMSACHAT> {
    return this.http.get<PARAMSACHAT>(this.FIND_ALL_ACHAT_PARAMETRE_URL);
  }

  saveParametres(parametres: PARAMSACHAT): Observable<PARAMSACHAT> {
    return this.http.post<PARAMSACHAT>(this.CREATE_ACHAT_PARAMETRE_URL, parametres);
  }
}
