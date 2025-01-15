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
import { EMPLOYE } from '../../../../../models/model-users/employe.model';
import { AddEmployeComponent } from '../../add-users/add-employe/add-employe.component';
import {
  Payement,
  TRANSACTION,
} from '../../../../../models/model-elements/transaction.model';
import { Status, TICKET } from '../../../../../models/model-elements/ticket.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
})
export class AddTransactionComponent implements OnInit {
  // Objet TRANSACTION
  transactionForm!: FormGroup;
  transactionObj!: TRANSACTION;
  listClients: EMPLOYE[] = [];

  // Référence auto-générée
  generatedReference: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getClients(); // Récupère la liste des clients au démarrage
  }

  private initializeForm(): void {
    this.transactionForm = this.formBuilder.group({
      date: [{ value: new Date(), disabled: true }],
      reference: [{ value: '', disabled: true }],
      refClient: [''],
      nom: [''],
      prenom: [''],
      nbrTicket: [1, [Validators.required, Validators.min(1)]],
      firstNumTicket: [''],
      lastNumTicket: [''],
      payement: [{ value: Payement.ESPECE, disabled: true }],
      montant: [{ value: 500, disabled: true }],
    });

    // Génération automatique des données nécessaires
    this.generateTransactionReference();
    this.generateTicketNumbers();
  }

  // Génération de la référence sous la forme AAAAMMJJGGGXXXX
  generateTransactionReference(): void {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const agencyNumber = '001'; // Remplacez par le numéro de votre agence

    // API pour récupérer les transactions du mois en cours pour l'agence donnée
    this.http.get<TRANSACTION[]>(`http://localhost:3000/transactions?year=${year}&month=${month}&agency=${agencyNumber}`).subscribe({
      next: (transactions) => {
        const lastTransaction = transactions.sort((a, b) => {
          const refA = parseInt(a.reference.slice(-4));
          const refB = parseInt(b.reference.slice(-4));
          return refB - refA;
        })[0];

        const lastNumber = lastTransaction ? parseInt(lastTransaction.reference.slice(-4)) : 0;
        const newNumber = (lastNumber + 1).toString().padStart(4, '0');

        // Génération de la nouvelle référence
        this.generatedReference = `${year}${month}${agencyNumber}${newNumber}`;
        // Mise à jour de la valeur dans le formulaire
        this.transactionForm.get('reference')?.setValue(this.generatedReference);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des transactions', err);
      },
    });
  }

  // Génération des numéros de tickets en fonction du nombre de tickets
  generateTicketNumbers(): void {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const agencyNumber = '001'; // Remplacez par le numéro de votre agence

    this.http.get<TRANSACTION[]>(`http://localhost:3000/transactions?year=${year}&agency=${agencyNumber}`).subscribe({
      next: (transactions) => {
        const tickets = transactions.flatMap(transaction => {
          const firstNum = parseInt(transaction.firstNumTicket.slice(-4));
          const lastNum = parseInt(transaction.lastNumTicket.slice(-4));
          return Array.from({ length: lastNum - firstNum + 1 }, (_, i) => firstNum + i);
        });

        const lastTicketNumber = Math.max(...tickets, 0);
        const ticketsCount = this.transactionForm.get('nbrTicket')?.value || 1;
        const firstTicketNumber = (lastTicketNumber + 1).toString().padStart(4, '0');
        const lastTicketNumberInLot = (lastTicketNumber + ticketsCount).toString().padStart(4, '0');

        const firstTicket = `${year}${month}${day}${agencyNumber}${firstTicketNumber}`;
        const lastTicket = `${year}${month}${day}${agencyNumber}${lastTicketNumberInLot}`;

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

  // Calcul du montant
  updateMontant(ticketsCount: number): void {
    const montant = ticketsCount * 500; // 500 FCFA par ticket
    this.transactionForm.patchValue({
      montant: montant,
    });
  }

  // Récupération des clients depuis l'API
  private getClients(): void {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    this.http.get<EMPLOYE[]>('http://localhost:3000/employes').subscribe({
      next: (clients) => {
        this.http.get<TRANSACTION[]>(`http://localhost:3000/transactions?year=${year}&month=${month}`).subscribe({
          next: (transactions) => {
            const usedClientRefs = new Set(
              transactions.map(transaction => transaction.refClient)
            );
            this.listClients = clients.filter(client => !usedClientRefs.has(client.numCnib));
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des transactions', err);
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients', err);
      },
    });
  }

  openModal() {
    this.modalService.open(AddEmployeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  // Méthode déclenchée lors du changement de client sélectionné
  onClientChange(event: any): void {
    const refClient = event.target.value;
    const selectedClient = this.listClients.find(
      (client) => client.numCnib === refClient || client.numPassport === refClient
    );

    if (selectedClient) {
      this.transactionForm.patchValue({
        nom: selectedClient.nom,
        prenom: selectedClient.prenom,
      });
    }
  }

  // Méthode pour sauvegarder ou mettre à jour une transaction
  Save(): void {
    if (this.transactionForm.valid) {
      // Utilisation de getRawValue pour inclure les champs désactivés
      this.transactionObj = { ...this.transactionObj, ...this.transactionForm.getRawValue() };

      let request$;

      if (this.transactionObj.id) {
        // Mise à jour de la transaction existante
        request$ = this.http.put<TRANSACTION>(`http://localhost:3000/transactions/${this.transactionObj.id}`, this.transactionObj);
      } else {
        // Création d'une nouvelle transaction
        request$ = this.http.post<TRANSACTION>('http://localhost:3000/transactions', this.transactionObj);
      }

      request$.subscribe({
        next: (res: TRANSACTION) => {
          console.log(`Transaction ${this.transactionObj.id ? 'mise à jour' : 'créée'} avec succès`, res);

          // Enregistrer les tickets après la création de la transaction
          this.saveTickets(res.reference, this.transactionForm.get('nbrTicket')?.value || 1);

          this.activeModal.close(this.transactionObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
        },
        error: (err) => {
          console.error('Erreur lors de l\'opération', err);
          alert(`Erreur lors de l'opération: ${err.message || 'Veuillez réessayer plus tard'}`);
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  // Génération et enregistrement des tickets
private saveTickets(refTransaction: string, nbrTicket: number): void {
  const firstNumTicket = parseInt(this.transactionForm.get('firstNumTicket')?.value || '0');
  const tickets: TICKET[] = [];

  for (let i = 0; i < nbrTicket; i++) {
    const ticketNum = (firstNumTicket + i).toString().padStart(15, '0');
    const ticketDate = new Date();
    ticketDate.setDate(ticketDate.getDate() + i); // Générer une date différente pour chaque ticket

    tickets.push({
      id: 0, // L'ID sera généré par le backend
      refTransaction,
      numero: ticketNum,
      dateValid: ticketDate,
      montant: 500, // Montant par ticket
      status: Status.VALIDE,
    });
  }

  this.http.post<TICKET[]>('http://localhost:3000/tickets', tickets).subscribe({
    next: (res) => {
      console.log('Tickets enregistrés avec succès :', res);
    },
    error: (err) => {
      console.error('Erreur lors de l\'enregistrement des tickets', err);
    },
  });
}

  Close(): void {
    this.activeModal.close();
  }
}
