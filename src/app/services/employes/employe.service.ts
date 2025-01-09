import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EMPLOYE } from 'src/app/views/composants/page-nouvel-user/new-employe/employe.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  employeObj: EMPLOYE = new EMPLOYE();
  private getUrl = 'http://localhost:3000/employes';
  private putUrl = `http://localhost:3000/employes/${this.employeObj.id}`;

  constructor(private http: HttpClient) {}

  addEmploye(employe: EMPLOYE): Observable<EMPLOYE>{
    return this.http.post<EMPLOYE>(this.getUrl, employe);
  }

  updateEmploye(employe: EMPLOYE): Observable<EMPLOYE>{
    return this.http.put<EMPLOYE>(this.putUrl, employe);
  }

  getEmployes(): Observable<EMPLOYE[]> {
    return this.http.get<EMPLOYE[]>(this.getUrl);
  }
}
