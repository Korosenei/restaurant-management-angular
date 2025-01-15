import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRANSACTION } from '../../../../../models/model-elements/transaction.model';

@Component({
  selector: 'app-list-transaction',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './list-transaction.component.html',
  styleUrl: './list-transaction.component.scss'
})
export class ListTransactionComponent implements OnInit {

  // Objet TRANSACTION
  ticketObj: TRANSACTION = new TRANSACTION();
  listTransactions: TRANSACTION[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.http.get<TRANSACTION[]>('http://localhost:3000/transactions').subscribe({
      next: (res) => {
        this.listTransactions = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des transactions", err);
      }
    });
  }

  onEdite(data: TRANSACTION) {}

  onDelete(id: number) {
    const isDelete = confirm(
      'Cette transaction sera supprimée après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer de la transaction à supprimer
      const transactionToDelete = this.listTransactions.find((ticket) => ticket.id === id);

      if (transactionToDelete) {
        // Ajouter de la transaction à la collection deletedTicket
        this.http
          .post<TRANSACTION>('http://localhost:3000/deleteTransaction', transactionToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer la transaction de la liste active
              this.listTransactions = this.listTransactions.filter((ticket) => ticket.id !== id);

              // Optionnel : Vous pouvez supprimer la transaction de la collection originale si vous le souhaitez
              this.http
                .delete<TRANSACTION>(`http://localhost:3000/transactions/${id}`)
                .subscribe({
                  next: () => {
                    alert('TRANSACTION supprimée de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression de la transaction dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement de la transaction vers deletedTransaction',
                err
              );
            },
          });
      } else {
        alert("La transaction n'a pas été trouvée.");
      }
    } else {
      alert('La suppression de la transaction est annulée.');
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
