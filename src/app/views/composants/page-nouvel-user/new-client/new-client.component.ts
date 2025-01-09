import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CLIENT, Genre, TypePiece } from './client.model';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent implements OnInit{

  listClients: CLIENT[] = [];
  clientForm!: FormGroup;
  clientObj: CLIENT = new CLIENT();
  selectedPieceType: string = '';

  // Liste des types de pièces
  readonly typePieces = Object.values(TypePiece);

  // Liste des genres
  readonly genres = Object.values(Genre);

  // Listes pour les options de sélection
  pieceTypes = [
    { value: 'CNIB', label: 'CNIB' },
    { value: 'PASSEPORT', label: 'PASSEPORT' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.clientForm = this.formBuilder.group({
      typePiece: [this.clientObj.typePiece, Validators.required],
      cnibNumber: [this.clientObj.cnibNumber],
      nipCnib: [this.clientObj.nipCnib],
      passportNumber: [this.clientObj.passportNumber],
      dateEtaPiece: [this.clientObj.dateEtaPiece, Validators.required],
      dateExpPiece: [this.clientObj.dateExpPiece, Validators.required],
      nom: [this.clientObj.nom, Validators.required],
      prenom: [this.clientObj.prenom, Validators.required],
      dateNaiss: [this.clientObj.dateNaiss, Validators.required],
      genre: [this.clientObj.genre, Validators.required],
      email: [this.clientObj.email, [Validators.required, Validators.email]],
      telephone: [this.clientObj.telephone, [Validators.required, Validators.pattern(/^[0-9]{8,}$/)]],
      localite: [this.clientObj.localite, Validators.required],
    });
  }


  Close(): void {
    this.activeModal.close();
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;

    if (this.selectedPieceType === TypePiece.CNIB) {
      this.clientForm.get('cnibNumber')?.setValidators([Validators.required]);
      this.clientForm.get('passportNumber')?.clearValidators();
    } else if (this.selectedPieceType === TypePiece.PASSPORT) {
      this.clientForm.get('passportNumber')?.setValidators([Validators.required]);
      this.clientForm.get('cnibNumber')?.clearValidators();
    }

    this.clientForm.get('cnibNumber')?.updateValueAndValidity();
    this.clientForm.get('passportNumber')?.updateValueAndValidity();
  }

  // Méthode pour enregistrer ou mettre à jour un client
  Save(): void {
    if (this.clientForm.valid) {
      const clientObj: CLIENT = this.clientForm.value;

      if (clientObj.typePiece === TypePiece.CNIB) {
        clientObj.passportNumber = ''; // Réinitialiser passportNumber si typePiece est CNIB
      } else if (clientObj.typePiece === TypePiece.PASSPORT) {
        clientObj.cnibNumber = '';
        clientObj.nipCnib = '';
      }

      const request$ = clientObj.id
        ? this.http.put<CLIENT>(`http://localhost:3000/clients/${clientObj.id}`, clientObj)
        : this.http.post<CLIENT>("http://localhost:3000/clients", clientObj);

      request$.subscribe({
        next: (res) => {
          console.log(`Client ${clientObj.id ? 'mise à jour' : 'créé'} avec succès`, res);
          this.activeModal.close(clientObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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
