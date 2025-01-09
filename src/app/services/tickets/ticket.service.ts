import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TICKET } from 'src/app/views/composants/page-nouvel-element/new-ticket/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  ticketObj: TICKET = new TICKET();
  private getUrl = 'http://localhost:3000/tickets';
  private putUrl = `http://localhost:3000/tickets/${this.ticketObj.id}`;

  constructor(private http: HttpClient) {}

  addTicket(ticket: TICKET): Observable<TICKET>{
    return this.http.post<TICKET>(this.getUrl, ticket);
  }

  updateTicket(ticket: TICKET): Observable<TICKET>{
    return this.http.put<TICKET>(this.putUrl, ticket);
  }

  getTickets(): Observable<TICKET[]> {
    return this.http.get<TICKET[]>(this.getUrl);
  }
}
