import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DIRECTION } from 'src/app/views/composants/page-nouvel-service/new-direction/direction.model';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  directionObj: DIRECTION = new DIRECTION();
  private getUrl = 'http://localhost:3000/directions';
  private putUrl = `http://localhost:3000/directions/${this.directionObj.id}`;

  constructor(private http: HttpClient) {}

  addDirection(direction: DIRECTION): Observable<DIRECTION>{
    return this.http.post<DIRECTION>(this.getUrl, direction);
  }

  updateDirection(direction: DIRECTION): Observable<DIRECTION>{
    return this.http.put<DIRECTION>(this.putUrl, direction);
  }

  getDirections(): Observable<DIRECTION[]> {
    return this.http.get<DIRECTION[]>(this.getUrl);
  }
}
