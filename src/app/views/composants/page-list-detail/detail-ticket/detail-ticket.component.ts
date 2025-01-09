import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TICKET } from '../../page-nouvel-element/new-ticket/ticket.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewTicketComponent } from '../../page-nouvel-element/new-ticket/new-ticket.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-ticket',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-ticket.component.html',
  styleUrl: './detail-ticket.component.scss'
})
export class DetailTicketComponent implements OnInit {
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

  onEdite(data: TICKET) {
    const modalRef = this.modalService.open(NewTicketComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.bankObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des tickets
          this.getTickets(); // Recharger la liste des tickets depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

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
