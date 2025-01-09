import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { REGISTRE } from './registre.model';
import { TICKET } from '../new-ticket/ticket.model';
import { CLUB } from '../../page-nouvel-service/new-club/club.model';

@Component({
  selector: 'app-new-registre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-registre.component.html',
  styleUrl: './new-registre.component.scss'
})
export class NewRegistreComponent implements OnInit{
  // Objet REGISTRE
  listRegistres: REGISTRE[] = [];
  registreForm!: FormGroup;
  registreObj: REGISTRE = new REGISTRE();

  // TICKET & CLUB
  listTickets: TICKET[] = [];
  listClubs: CLUB[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getClubs();
    this.getTickets();
  }

  initializeForm(): void{
    this.registreForm = this.formBuilder.group({
      nom: [this.registreObj.nom, Validators.required],
      prenom: [this.registreObj.prenom, Validators.required],
      telephone: [this.registreObj.telephone, Validators.required],
      numeroPiece: [this.registreObj.numeroPiece, Validators.required],
      numeroTicket: [this.registreObj.numeroTicket, Validators.required],
      montant: [this.registreObj.montant, Validators.required,],
      date: [this.registreObj.date, Validators.required],
      codeClub: [{ value: 'C208-DRC-A76', disabled: true }],
    });
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

  onTicketChange(event: any) {
    const selectedTicket = this.listTickets.find(ticket => ticket.numero === event.target.value);
    if (selectedTicket) {
      this.registreForm.patchValue({
        montant: selectedTicket.montant,
      });
    }
  }

  getClubs() {
    this.http.get<CLUB[]>('http://localhost:3000/clubs').subscribe({
      next: (res) => {
        this.listClubs = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des clubs", err);
      }
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.registreForm.valid) {
      this.registreObj = { ...this.registreObj, ...this.registreForm.value }; // Met à jour registreObj avec les valeurs du formulaire

      let request$;

      if (this.registreObj.id) {
        // Mise à jour du registre existant
        request$ = this.http.put<REGISTRE>(
          `http://localhost:3000/registres/${this.registreObj.id}`,
          this.registreObj
        );
      } else {
        // Création d'un nouvel registre
        request$ = this.http.post<REGISTRE>(
          'http://localhost:3000/registres',
          this.registreObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `club ${
              this.registreObj.id ? 'mise à jour' : 'créée'
            } avec succès`,
            res
          );
          this.activeModal.close(this.registreObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
        },
        error: (err) => {
          console.error("Erreur lors de l'opération", err);
          alert(
            `Erreur lors de l'opération: ${
              err.message || 'Veuillez réessayer plus tard'
            }`
          );
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }
}
