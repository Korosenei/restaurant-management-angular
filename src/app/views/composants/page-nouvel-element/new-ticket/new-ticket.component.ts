import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TICKET } from './ticket.model';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.scss'
})
export class NewTicketComponent implements OnInit{

  // Objet TICKET
  listTickets: TICKET[] = [];
  ticketForm!: FormGroup;
  ticketObj: TICKET = new TICKET();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      numero: ['', Validators.required],
      produit: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(5000001)]],
      dateJeu: ['', Validators.required],
      naturePayement: [{ value: 'CHEQUE BANCAIRE', disabled: true }],
  });
  }

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.ticketForm.valid) {
      this.ticketObj = { ...this.ticketObj, ...this.ticketForm.value }; // Met à jour ticketObj avec les valeurs du formulaire

      let request$;

      if (this.ticketObj.id) {
        // Mise à jour du ticket existant
        request$ = this.http.put<TICKET>(
          `http://localhost:3000/tickets/${this.ticketObj.id}`,
          this.ticketObj
        );
      } else {
        // Création d'un nouvel ticket
        request$ = this.http.post<TICKET>(
          'http://localhost:3000/tickets',
          this.ticketObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `ticket ${
              this.ticketObj.id ? 'mise à jour' : 'créée'
            } avec succès`,
            res
          );
          this.activeModal.close(this.ticketObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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
