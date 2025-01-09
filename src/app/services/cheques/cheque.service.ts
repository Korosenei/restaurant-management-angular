import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CHEQUE } from 'src/app/views/composants/page-nouvel-element/new-cheque/cheque.model';

@Injectable({
  providedIn: 'root'
})
export class ChequeService {

  chequeObj: CHEQUE = new CHEQUE();
  private getUrl = 'http://localhost:3000/cheques';
  private putUrl = `http://localhost:3000/cheques/${this.chequeObj.id}`;

  constructor(private http: HttpClient) {}

  addCheque(cheque: CHEQUE): Observable<CHEQUE>{
    return this.http.post<CHEQUE>(this.getUrl, cheque);
  }

  updateCheque(cheque: CHEQUE): Observable<CHEQUE>{
    return this.http.put<CHEQUE>(this.putUrl, cheque);
  }

  getCheques(): Observable<CHEQUE[]> {
    return this.http.get<CHEQUE[]>(this.getUrl);
  }
}
