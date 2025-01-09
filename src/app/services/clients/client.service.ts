import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT } from 'src/app/views/composants/page-nouvel-user/new-client/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /* clientObj: CLIENT = new CLIENT();
  private getUrl = 'http://localhost:3000/clients';
  private putUrl = `http://localhost:3000/clients/${this.clientObj.id}`;

  constructor(private http: HttpClient) {}

  addClient(client: CLIENT): Observable<CLIENT>{
    return this.http.post<CLIENT>(this.getUrl, client);
  }

  updateClient(client: CLIENT): Observable<CLIENT>{
    return this.http.put<CLIENT>(this.putUrl, client);
  }

  getClients(): Observable<CLIENT[]> {
    return this.http.get<CLIENT[]>(this.getUrl);
  } */
}
