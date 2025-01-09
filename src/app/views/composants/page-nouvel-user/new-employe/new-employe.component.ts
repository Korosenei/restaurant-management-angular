import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { EMPLOYE, Genre, Role, TypePiece } from './employe.model';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeService } from 'src/app/services/employes/employe.service';

@Component({
  selector: 'app-new-employe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-employe.component.html',
  styleUrl: './new-employe.component.scss'
})
export class NewEmployeComponent implements OnInit {

  listEmployes: EMPLOYE[] = [];
  employeeForm!: FormGroup;
  employeeObj: EMPLOYE = new EMPLOYE();
  selectedPieceType: string = '';

  // Liste des types de pièces
  readonly typePieces = Object.values(TypePiece);

  // Liste des genres
  readonly genres = Object.values(Genre);

  // Liste des roles
  readonly roles = Object.values(Role);

  agences = [
    { value: 'Grand marché', label: 'Grand marché' },
    { value: 'Cité An III', label: 'Cité An III' },
  ];

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
    this.employeeForm = this.formBuilder.group({
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
      role: ['', Validators.required],
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;

    if (this.selectedPieceType === TypePiece.CNIB) {
      this.employeeForm.get('cnibNumber')?.setValidators([Validators.required]);
      this.employeeForm.get('passportNumber')?.clearValidators();
    } else if (this.selectedPieceType === TypePiece.PASSPORT) {
      this.employeeForm.get('passportNumber')?.setValidators([Validators.required]);
      this.employeeForm.get('cnibNumber')?.clearValidators();
    }

    this.employeeForm.get('cnibNumber')?.updateValueAndValidity();
    this.employeeForm.get('passportNumber')?.updateValueAndValidity();
  }

  // Méthode pour enregistrer ou mettre à jour un employé
  Save() {
    if (this.employeeForm.valid) {
      const employeObj: EMPLOYE = this.employeeForm.value;

      if (employeObj.typePiece === TypePiece.CNIB) {
        employeObj.passportNumber = ''; // Réinitialiser passportNumber si typePiece est CNIB
      } else if (employeObj.typePiece === TypePiece.PASSPORT) {
        employeObj.cnibNumber = '';
        employeObj.nipCnib = '';
      }

      const request$ = employeObj.id
      ? this.http.put<EMPLOYE>(`http://localhost:3000/employes/${employeObj.id}`, employeObj)
      : this.http.post<EMPLOYE>("http://localhost:3000/employes", employeObj);

    request$.subscribe({
      next: (res) => {
        console.log(`Employe ${employeObj.id ? 'mise à jour' : 'créé'} avec succès`, res);
        this.activeModal.close(employeObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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
