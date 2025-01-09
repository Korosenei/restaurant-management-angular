import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GERANT } from './gerant.model';

@Component({
  selector: 'app-new-gerant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-gerant.component.html',
  styleUrl: './new-gerant.component.scss'
})
export class NewGerantComponent implements OnInit{

  listGerants: GERANT[] = [];
  gerantForm!: FormGroup;
  gerantObj: GERANT = new GERANT();
  selectedPieceType: string = '';

  // Listes pour les options de sélection
  pieceTypes = [
    { value: 'CNIB', label: 'CNIB' },
    { value: 'PASSEPORT', label: 'PASSEPORT' },
  ];

  genres = [
    { value: 'HOMME', label: 'Homme' },
    { value: 'FEMME', label: 'Femme' },
  ];

  clubs = [
    { value: 'Grand marché', label: 'Grand marché' },
    { value: 'Cité An III', label: 'Cité An III' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.gerantForm = this.formBuilder.group({
      matricule: ['', Validators.required],
      typePiece: ['', Validators.required],
      cnibNumber: [''],
      nipCnib: [''],
      passportNumber: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      genre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;
  }

  // Méthode pour enregistrer ou mettre à jour un gerant
  Save() {
    if (this.gerantForm.valid) {
      this.gerantObj = { ...this.gerantObj, ...this.gerantForm.value }; // Met à jour gerantObj avec les valeurs du formulaire

      let request$;

      if (this.gerantObj.id) {
        // Mise à jour du gerant existant
        request$ = this.http.put<GERANT>(`http://localhost:3000/gerants/${this.gerantObj.id}`, this.gerantObj);
      } else {
        // Création d'un nouvel gerant
        request$ = this.http.post<GERANT>("http://localhost:3000/gerants", this.gerantObj);
      }

      request$.subscribe({
        next: (res) => {
          console.log(`Gerant ${this.gerantObj.id ? 'mise à jour' : 'créée'} avec succès`, res);
          this.activeModal.close(this.gerantObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
        },
        error: (err) => {
          console.error("Erreur lors de l'opération", err);
          alert(`Erreur lors de l'opération: ${err.message || 'Veuillez réessayer plus tard'}`);
        }
      });
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  }

}
