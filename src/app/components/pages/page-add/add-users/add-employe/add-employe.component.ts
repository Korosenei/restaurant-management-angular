import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { EMPLOYE, Genre, Role, TypePiece } from '../../../../../models/model-users/employe.model';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-employe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './add-employe.component.html',
  styleUrl: './add-employe.component.scss'
})
export class AddEmployeComponent implements OnInit {

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
      numCnib: [''],
      nipCnib: [''],
      numPassport: [''],
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
      this.employeeForm.get('numCnib')?.setValidators([Validators.required]);
      this.employeeForm.get('numPassport')?.clearValidators();
    } else if (this.selectedPieceType === TypePiece.PASSPORT) {
      this.employeeForm.get('numPassport')?.setValidators([Validators.required]);
      this.employeeForm.get('numCnib')?.clearValidators();
    }

    this.employeeForm.get('numCnib')?.updateValueAndValidity();
    this.employeeForm.get('numPassport')?.updateValueAndValidity();
  }

  Save() {
  throw new Error('Method not implemented.');
  }

}
