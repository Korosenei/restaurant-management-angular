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
import { Payement, TRANSACTION } from '../../../../../models/model-elements/transaction.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit{

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.transactionForm = this.formBuilder.group({
      date: [{ value: new Date(), disabled: true }],
      reference: [{ value: '', disabled: true }],
      refClient: ['', Validators.required],
      nom: [''],
      prenom: [''],
      nbrTicket: [1, Validators.required],
      firstNumTicket: [''],
      lastNumTicket: [''],
      payement: [{ value: Payement.ESPECE, disabled: true }],
      montant: [{ value: 500, disabled: true }],
    });

    // Appel de la méthode de génération de la référence
    this.generateReference();
  }

  // Génération de la référence sous la forme AAAAMMJJGGGXXXX
  generateReference(): void {
    const today = new Date();

    // Récupération de l'année, du mois et du jour
    const annee = today.getFullYear().toString();
    const mois = (today.getMonth() + 1).toString().padStart(2, '0');
    const jour = today.getDate().toString().padStart(2, '0');

    // Numéro de l'agence (par exemple, récupéré dynamiquement à partir du formulaire)
    const numeroAgence = this.transactionForm.get('agence')?.value?.padStart(3, '0') || '001'; // Par défaut '001'

    // Récupération de toutes les transactions pour trouver celles du jour
    this.http.get<TRANSACTION[]>('http://localhost:3000/transactions').subscribe({
      next: (transactions) => {
        // Filtrer les transactions par date (année, mois, jour) et numéro d'agence
        const transactionsDuJour = transactions.filter(transaction => {
          const reference = transaction.reference;
          const anneeTransaction = reference.slice(0, 4);
          const moisTransaction = reference.slice(4, 6);
          const jourTransaction = reference.slice(6, 8);
          const numeroAgenceTransaction = reference.slice(8, 11);

          return anneeTransaction === annee &&
                 moisTransaction === mois &&
                 jourTransaction === jour &&
                 numeroAgenceTransaction === numeroAgence;
        });

        if (transactionsDuJour.length > 0) {
          // Trier les transactions par le numéro de référence (les 4 derniers chiffres) pour trouver le dernier
          const lastTransaction = transactionsDuJour.sort((a, b) => {
            const refA = parseInt(a.reference.slice(-4)); // Les 4 derniers caractères de la référence
            const refB = parseInt(b.reference.slice(-4));
            return refB - refA; // Tri décroissant
          })[0];

          // Extraire le numéro de la dernière référence du jour et l'incrémenter
          const lastReferenceNumber = parseInt(lastTransaction.reference.slice(-4)) || 0;
          const newReferenceNumber = (lastReferenceNumber + 1).toString().padStart(4, '0');

          // Générer la nouvelle référence pour aujourd'hui
          this.generatedReference = `${annee}${mois}${jour}${numeroAgence}${newReferenceNumber}`;
        } else {
          // Si aucune demande n'a été faite aujourd'hui, on commence avec la première référence
          this.generatedReference = `${annee}${mois}${jour}${numeroAgence}0001`;
        }

        // Mettre à jour le formulaire avec la nouvelle référence
        this.transactionForm.get('reference')?.setValue(this.generatedReference);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des transactions', err);
        alert('Erreur lors de la génération de la référence.');
      },
    });
  }

  private getClients(): void {
    this.http.get<EMPLOYE[]>('http://localhost:3000/employes').subscribe({
      next: (clients) => {
        this.listClients = clients;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés', err);
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

  Save(): void {

  }

  Close(): void {
    this.activeModal.close();
  }
}
