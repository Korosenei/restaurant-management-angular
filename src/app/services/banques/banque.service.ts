import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BANK } from 'src/app/views/composants/page-nouvel-element/new-banque/banque.model';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {

  bankObj: BANK = new BANK();
  private getUrl = 'http://localhost:3000/banques';
  private putUrl = `http://localhost:3000/banques/${this.bankObj.id}`;

  constructor(private http: HttpClient) {}

  addBank(bank: BANK): Observable<BANK>{
    return this.http.post<BANK>(this.getUrl, bank);
  }

  updateBank(bank: BANK): Observable<BANK>{
    return this.http.put<BANK>(this.putUrl, bank);
  }

  getBanks(): Observable<BANK[]> {
    return this.http.get<BANK[]>(this.getUrl);
  }

  /* deleteBank() : Observable<any>{
    return this.http.delete('http://localhost:3000/banques/${id}');
  } */
}
