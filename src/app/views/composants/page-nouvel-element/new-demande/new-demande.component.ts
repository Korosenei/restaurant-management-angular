import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DEMANDE, Status} from './demande.model';
import { CLIENT } from '../../page-nouvel-user/new-client/client.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewClientComponent } from '../../page-nouvel-user/new-client/new-client.component';
import { Payement, Produit, TICKET } from '../new-ticket/ticket.model';

@Component({
  selector: 'app-new-demande',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NewClientComponent,
  ],
  templateUrl: './new-demande.component.html',
  styleUrl: './new-demande.component.scss',
})
export class NewDemandeComponent implements OnInit {
  // Objet DEMANDE
  demandeForm!: FormGroup;
  demandeObj!: DEMANDE;
  listDemandes: DEMANDE[] = [];
  listClients: CLIENT[] = [];

  // Référence auto-générée
  generatedReference: string = '';

  // Liste des produits
  readonly produits = Object.values(Produit);

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getClients();
  }

  private initializeForm(): void {
    this.demandeForm = this.formBuilder.group({
      etablisementDate: [{ value: new Date(), disabled: true }],
      reference: [{ value: '', disabled: true }],
      refClient: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      ticketDto: this.formBuilder.group({
        numero: ['', Validators.required],
        produit: [Produit.PMUB, Validators.required],
        montant: [5000000, Validators.required],
        dateJeu: [new Date(), Validators.required],
        naturePayement: [{ value: Payement.CHEQUE, disabled: true }, Validators.required],
      }),
      status: [{ value: Status.INITIE, disabled: true }, Validators.required],
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
    const numeroAgence = this.demandeForm.get('agence')?.value?.padStart(3, '0') || '001'; // Par défaut '001'

    // Récupération de toutes les demandes pour trouver celles du jour
    this.http.get<DEMANDE[]>('http://localhost:3000/demandes').subscribe({
      next: (demandes) => {
        // Filtrer les demandes par date (année, mois, jour) et numéro d'agence
        const demandesDuJour = demandes.filter(demande => {
          const reference = demande.reference;
          const anneeDemande = reference.slice(0, 4);
          const moisDemande = reference.slice(4, 6);
          const jourDemande = reference.slice(6, 8);
          const numeroAgenceDemande = reference.slice(8, 11);

          return anneeDemande === annee &&
                 moisDemande === mois &&
                 jourDemande === jour &&
                 numeroAgenceDemande === numeroAgence;
        });

        if (demandesDuJour.length > 0) {
          // Trier les demandes par le numéro de référence (les 4 derniers chiffres) pour trouver le dernier
          const lastDemande = demandesDuJour.sort((a, b) => {
            const refA = parseInt(a.reference.slice(-4)); // Les 4 derniers caractères de la référence
            const refB = parseInt(b.reference.slice(-4));
            return refB - refA; // Tri décroissant
          })[0];

          // Extraire le numéro de la dernière référence du jour et l'incrémenter
          const lastReferenceNumber = parseInt(lastDemande.reference.slice(-4)) || 0;
          const newReferenceNumber = (lastReferenceNumber + 1).toString().padStart(4, '0');

          // Générer la nouvelle référence pour aujourd'hui
          this.generatedReference = `${annee}${mois}${jour}${numeroAgence}${newReferenceNumber}`;
        } else {
          // Si aucune demande n'a été faite aujourd'hui, on commence avec la première référence
          this.generatedReference = `${annee}${mois}${jour}${numeroAgence}0001`;
        }

        // Mettre à jour le formulaire avec la nouvelle référence
        this.demandeForm.get('reference')?.setValue(this.generatedReference);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des demandes', err);
        alert('Erreur lors de la génération de la référence.');
      },
    });
  }


  private getClients(): void {
    this.http.get<CLIENT[]>('http://localhost:3000/clients').subscribe({
      next: (clients) => {
        this.listClients = clients;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients', err);
      },
    });
  }

  openModal() {
    this.modalService.open(NewClientComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onClientChange(event: any): void {
    const refClient = event.target.value;
    const selectedClient = this.listClients.find(
      (client) => client.cnibNumber === refClient || client.passportNumber === refClient
    );

    if (selectedClient) {
      this.demandeForm.patchValue({
        nom: selectedClient.nom,
        prenom: selectedClient.prenom,
      });
    }
  }

  Save(): void {
    if (this.demandeForm.valid) {
      const demandeData = { ...this.demandeForm.getRawValue(), ticketDto: { ...this.demandeForm.value.ticketDto }};
      this.demandeObj = new DEMANDE(demandeData);

      // Sauvegarder la demande
      const request$ = this.demandeObj.id
        ? this.http.put<DEMANDE>(`http://localhost:3000/demandes/${this.demandeObj.id}`, this.demandeObj)
        : this.http.post<DEMANDE>('http://localhost:3000/demandes', this.demandeObj);

      request$.subscribe({
        next: (demandeRes) => {
          console.log(`Demande ${this.demandeObj.id ? 'mise à jour' : 'créée'} avec succès`, demandeRes);

          // Enregistrer le ticket associé à la demande après la création de la demande
          this.saveTicket(demandeRes.ticketDto);
        },
        error: (err) => {
          console.error('Erreur lors de la création/mise à jour de la demande', err);
          alert(`Erreur: ${err.message || 'Veuillez réessayer plus tard'}`);
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  // Méthode pour enregistrer le ticket dans la DB
  private saveTicket(ticket: TICKET): void {
    this.http.post<TICKET>('http://localhost:3000/tickets', ticket).subscribe({
      next: (ticketRes) => {
        console.log('Ticket enregistré avec succès', ticketRes);
        this.activeModal.close('created');
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement du ticket', err);
        alert(`Erreur: ${err.message || 'Veuillez réessayer plus tard'}`);
      }
    });
  }

  Close(): void {
    this.activeModal.close();
  }
}
