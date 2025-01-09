import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModule } from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BANK } from './banque.model';

@Component({
  selector: 'app-new-banque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-banque.component.html',
  styleUrl: './new-banque.component.scss'
})

export class NewBanqueComponent implements OnInit {

  // Objet BANQUE
  listBanks: BANK[] = [];
  bankForm!: FormGroup;
  @Input() bankObj: BANK = new BANK();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.bankForm = this.formBuilder.group({
      code: [this.bankObj.code, Validators.required],
      name: [this.bankObj.name, Validators.required],
      sigle: [this.bankObj.sigle, Validators.required]
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.bankForm.valid) {
      this.bankObj = { ...this.bankObj, ...this.bankForm.value }; // Met à jour bankObj avec les valeurs du formulaire

      let request$;

      if (this.bankObj.id) {
        // Mise à jour de la banque existante
        request$ = this.http.put<BANK>(
          `http://localhost:3000/banques/${this.bankObj.id}`,
          this.bankObj
        );
      } else {
        // Création d'une nouvelle banque
        request$ = this.http.post<BANK>(
          'http://localhost:3000/banques',
          this.bankObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `banque ${
              this.bankObj.id ? 'mise à jour' : 'créée'
            } avec succès`,
            res
          );
          this.activeModal.close(this.bankObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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

