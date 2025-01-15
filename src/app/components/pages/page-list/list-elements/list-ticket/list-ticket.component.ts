import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TICKET } from '../../../../../models/model-elements/ticket.model';

@Component({
  selector: 'app-list-ticket',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './list-ticket.component.html',
  styleUrl: './list-ticket.component.scss'
})
export class ListTicketComponent implements OnInit {
  
  // Objet TICKET
  ticketObj: TICKET = new TICKET();
  listTickets: TICKET[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets() {
    this.http.get<TICKET[]>('http://localhost:3000/tickets').subscribe({
      next: (res) => {
        this.listTickets = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des tickets", err);
      }
    });
  }

  onEdite(data: TICKET) {}

  onDelete(id: number) {
    const isDelete = confirm(
      'Ce ticket sera supprimé après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer du ticket à supprimer
      const ticketToDelete = this.listTickets.find((ticket) => ticket.id === id);

      if (ticketToDelete) {
        // Ajouter du ticket à la collection deletedTicket
        this.http
          .post<TICKET>('http://localhost:3000/deleteTicket', ticketToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le ticket de la liste active
              this.listTickets = this.listTickets.filter((ticket) => ticket.id !== id);

              // Optionnel : Vous pouvez supprimer le ticket de la collection originale si vous le souhaitez
              this.http
                .delete<TICKET>(`http://localhost:3000/tickets/${id}`)
                .subscribe({
                  next: () => {
                    alert('TICKET supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression du ticket dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement du ticket vers deletedTicket',
                err
              );
            },
          });
      } else {
        alert("Le ticket n'a pas été trouvée.");
      }
    } else {
      alert('La suppression du ticket est annulée.');
    }
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('Key down', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key up', event.key);
  }

}
