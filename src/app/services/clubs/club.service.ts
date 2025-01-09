import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLUB } from 'src/app/views/composants/page-nouvel-service/new-club/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  clubObj: CLUB = new CLUB();
  private getUrl = 'http://localhost:3000/clubs';
  private putUrl = `http://localhost:3000/clubs/${this.clubObj.id}`;

  constructor(private http: HttpClient) {}

  addClub(club: CLUB): Observable<CLUB>{
    return this.http.post<CLUB>(this.getUrl, club);
  }

  updateClub(club: CLUB): Observable<CLUB>{
    return this.http.put<CLUB>(this.putUrl, club);
  }

  getClubs(): Observable<CLUB[]> {
    return this.http.get<CLUB[]>(this.getUrl);
  }
}
