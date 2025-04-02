import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Payement,
  TRANSACTION,
} from '../../../../../models/model-elements/transaction.model';
import {
  Status,
  TICKET,
} from '../../../../../models/model-elements/ticket.model';
import { USER } from '../../../../../models/model-users/user.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
})
export class AddTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  transactionObj!: TRANSACTION;
  listClients: USER[] = [];
  generatedReference: string = '';
  private isProcessing = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getClients();
  }

  /**
   * Initialisation du formulaire de transaction.
   */
  private initializeForm(): void {
    this.transactionForm = this.formBuilder.group({
      date: [{ value: new Date(), disabled: true }],
      reference: [{ value: '', disabled: true }],
      userId: ['', Validators.required],
      nom: [''],
      prenom: [''],
      nbrTicket: [1, [Validators.required, Validators.max(25)]],
      ticketDto: this.formBuilder.group({
        numero: [''],
        dateValid: [new Date()],
        status: [Status.VALIDE],
      }),
      firstNumTicket: [''],
      lastNumTicket: [''],
      payement: [{ value: Payement.ESPECE, disabled: true }],
      montant: [{ value: 500, disabled: true }],
    });

    this.generateTransactionReference();
    this.generateTicketNumbers();
  }

  /**
   * Génère une référence unique pour la transaction.
   */
  generateTransactionReference(): void {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const agencyNumber = 'AG-001';

    this.http
      .get<TRANSACTION[]>(
        `http://localhost:2027/transactions/all?year=${year}&month=${month}&agency=${agencyNumber}`
      )
      .subscribe({
        next: (transactions) => {
          const lastTransaction = transactions.sort((a, b) => {
            const refA = parseInt(a.reference.slice(-3));
            const refB = parseInt(b.reference.slice(-3));
            return refB - refA;
          })[0];

          const lastNumber = lastTransaction
            ? parseInt(lastTransaction.reference.slice(-3))
            : 0;
          const newNumber = (lastNumber + 1).toString().padStart(3, '0');

          this.generatedReference = `${year}${month}${agencyNumber}${newNumber}`;
          this.transactionForm
            .get('reference')
            ?.setValue(this.generatedReference);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des transactions', err);
        },
      });
  }

  /**
   * Génération des numéros de tickets.
   */
  generateTicketNumbers(): void {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const agencyNumber = 'AG-001';

    this.http
      .get<TRANSACTION[]>(
        `http://localhost:2027/transactions/all?year=${year}&agency=${agencyNumber}`
      )
      .subscribe({
        next: (transactions) => {
          const tickets = transactions.flatMap((transaction) => {
            const firstNum = parseInt(transaction.firstNumTicket.slice(-4));
            const lastNum = parseInt(transaction.lastNumTicket.slice(-4));
            return Array.from(
              { length: lastNum - firstNum + 1 },
              (_, i) => firstNum + i
            );
          });

          const lastTicketNumber = Math.max(...tickets, 0);
          const ticketsCount =
            this.transactionForm.get('nbrTicket')?.value || 1;
          const firstTicketNumber = (lastTicketNumber + 1)
            .toString()
            .padStart(4, '0');
          const lastTicketNumberInLot = (lastTicketNumber + ticketsCount)
            .toString()
            .padStart(4, '0');

          const firstTicket = `${year}${month}${agencyNumber}${firstTicketNumber}`;
          const lastTicket = `${year}${month}${agencyNumber}${lastTicketNumberInLot}`;

          this.transactionForm.patchValue({
            firstNumTicket: firstTicket,
            lastNumTicket: lastTicket,
          });

          this.updateMontant(ticketsCount);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tickets', err);
        },
      });
  }

  /**
   * Calcule le montant total basé sur le nombre de tickets.
   */
  updateMontant(ticketsCount: number): void {
    const montant = ticketsCount * 500;
    this.transactionForm.patchValue({
      montant: montant,
    });
  }

  /**
   * Récupère les clients depuis l'API.
   */
  private getClients(): void {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    this.http.get<USER[]>('http://localhost:2028/users/all').subscribe({
      next: (clients) => {
        this.http
          .get<TRANSACTION[]>(
            `http://localhost:2027/transactions/all?year=${year}&month=${month}`
          )
          .subscribe({
            next: (transactions) => {
              const usedClientRefs = new Set(
                transactions.map((transaction) => transaction.id)
              );
              this.listClients = clients.filter(
                (client) => !usedClientRefs.has(client.id)
              );
            },
            error: (err) => {
              console.error(
                'Erreur lors de la récupération des transactions',
                err
              );
            },
          });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients', err);
      },
    });
  }

  /**
   * Méthode appelée lors du changement de client sélectionné.
   */
  onClientChange(event: any): void {
    const userId = Number(event.target.value);
    console.log('Utilisateur sélectionné:', userId);

    const selectedClient = this.listClients.find(
      (client) => client.id === userId
    );

    if (selectedClient) {
      this.transactionForm.patchValue({
        userId: selectedClient.id,
        nom: selectedClient.nom,
        prenom: selectedClient.prenom,
      });
      console.log('Formulaire après mise à jour:', this.transactionForm.value);
    }
  }

  /**
   * Sauvegarde la transaction et génère les tickets associés.
   */
  Save(): void {
    if (this.transactionForm.invalid || this.isProcessing) {
      alert(
        'Veuillez remplir correctement le formulaire ou attendez la fin du traitement.'
      );
      return;
    }

    this.isProcessing = true; // Empêcher les doubles soumissions
    this.transactionForm.disable();
    alert('Enregistrement en cours...');

    const newTransaction: TRANSACTION = {
      ...this.transactionForm.getRawValue(),
      ticketDto: { ...this.transactionForm.value.ticketDto },
      userDto: { id: this.transactionForm.value.userId },
    };

    this.http
      .post<TRANSACTION>(
        'http://localhost:2027/transactions/create',
        newTransaction
      )
      .subscribe({
        next: (savedTransaction) => {
          alert('Transaction enregistrée avec succès !');

          // Mise à jour de l'ID de la transaction pour les tickets
          /* newTransaction.id = savedTransaction.id; */
          this.generateAndSaveTickets(newTransaction);
        },
        error: (err) => {
          console.error(
            'Erreur lors de l’enregistrement de la transaction',
            err
          );
          alert('Une erreur est survenue lors de l’enregistrement.');
          this.transactionForm.enable();
          this.isProcessing = false;
        },
      });
  }

  /**
   * Génère et sauvegarde les tickets associés à une transaction.
   */
  generateAndSaveTickets(transaction: TRANSACTION): void {
    const firstTicketNumber = parseInt(transaction.firstNumTicket.slice(-4));
    const lastTicketNumber = parseInt(transaction.lastNumTicket.slice(-4));
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const agencyNumber = 'AGE-001';

    const tickets: TICKET[] = [];
    for (let i = firstTicketNumber; i <= lastTicketNumber; i++) {
      const ticketNumber = `${year}${month}${agencyNumber}${i
        .toString()
        .padStart(4, '0')}`;
      const dateValid = new Date();
      dateValid.setDate(new Date().getDate() + (i - firstTicketNumber));

      const ticket: TICKET = new TICKET({
        numero: ticketNumber,
        dateValid: dateValid,
        status: Status.VALIDE,
        transactionDto: {
          id: transaction.id,
          reference: transaction.reference,
          userId: transaction.userDto?.id,
        } as TRANSACTION,
        userDto: transaction.userDto,
      });

      tickets.push(ticket);
    }

    // Sauvegarder les tickets
    tickets.forEach((ticket) => {
      this.http
        .post<TICKET>('http://localhost:2027/tickets/create', ticket)
        .subscribe({
          next: (savedTicket: TICKET) => {
            console.log('Ticket sauvegardé avec succès :', savedTicket);
          },
          error: (err) => {
            console.error('Erreur lors de la sauvegarde du ticket', err);
          },
        });
    });

    // Mettre à jour la transaction avec les informations du premier ticket
    transaction.ticketDto = tickets[0]; // Ajouter le premier ticket dans la transaction
    this.http
      .put<TRANSACTION>(
        `http://localhost:2027/transactions/update/${transaction.id}`,
        transaction
      )
      .subscribe({
        next: (updatedTransaction) => {
          console.log(
            'Transaction mise à jour avec succès :',
            updatedTransaction
          );
          this.activeModal.close('saved');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la transaction', err);
        },
      });

    this.activeModal.close('saved');
  }

  /**
   * Ferme le modal actif.
   */
  Close(): void {
    this.activeModal.close();
  }
}
