import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddTicketComponent } from '../../../pages/page-add/add-elements/add-ticket/add-ticket.component';
import { ListTicketComponent } from '../../../pages/page-list/list-elements/list-ticket/list-ticket.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClient } from '@angular/common/http';
import { TICKET, Status } from '../../../../models/model-elements/ticket.model';
import { TRANSACTION } from '../../../../models/model-elements/transaction.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddTicketComponent,
    ListTicketComponent,
    PaginationComponent,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) {}

  /* generateTicketsForExistingTransactions(): void {
    // Récupérer toutes les transactions depuis l'API
    this.http
      .get<TRANSACTION[]>('http://localhost:3000/transactions')
      .subscribe({
        next: (transactions) => {
          transactions.forEach((transaction) => {
            // Vérifier si des tickets existent déjà pour cette transaction
            this.http
              .get<TICKET[]>(
                `http://localhost:3000/tickets?refTransaction=${transaction.reference}`
              )
              .subscribe({
                next: (tickets) => {
                  const nbrTicketsExistants = tickets.length;
                  const nbrTicketsManquants =
                    transaction.nbrTicket - nbrTicketsExistants;

                  if (nbrTicketsManquants > 0) {
                    console.log(
                      `Génération de ${nbrTicketsManquants} tickets manquants pour la transaction ${transaction.reference}`
                    );
                    // Générer les tickets manquants
                    this.generateAndSaveTickets(
                      transaction,
                      nbrTicketsExistants
                    );
                  } else {
                    console.log(
                      `Tous les tickets sont déjà générés pour la transaction ${transaction.reference}`
                    );
                  }
                },
                error: (err) => {
                  console.error(
                    `Erreur lors de la vérification des tickets pour la transaction ${transaction.reference}`,
                    err
                  );
                },
              });
          });
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des transactions', err);
        },
      });
  }

  // Génération et enregistrement des tickets manquants
  private generateAndSaveTickets(
    transaction: TRANSACTION,
    startIndex: number
  ): void {
    const firstNumTicket = parseInt(transaction.firstNumTicket || '0');
    const tickets: TICKET[] = [];

    for (let i = startIndex; i < transaction.nbrTicket; i++) {
      const ticketNum = (firstNumTicket + i).toString().padStart(15, '0');
      const ticketDate = new Date();
      ticketDate.setDate(ticketDate.getDate() + i); // Générer une date différente pour chaque ticket

      tickets.push({
        id: 0, // L'ID sera généré par le backend
        refTransaction: transaction.reference,
        numero: ticketNum,
        dateValid: ticketDate,
        montant: 500, // Montant par ticket
        status: Status.VALIDE,
      });
    }

    this.http
      .post<TICKET[]>('http://localhost:3000/tickets', tickets)
      .subscribe({
        next: (res) => {
          console.log(
            `Tickets enregistrés avec succès pour la transaction ${transaction.reference}`,
            res
          );
        },
        error: (err) => {
          console.error(
            `Erreur lors de l'enregistrement des tickets pour la transaction ${transaction.reference}`,
            err
          );
        },
      });
  } */
}
