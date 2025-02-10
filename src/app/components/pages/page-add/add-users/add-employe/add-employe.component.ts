import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EMPLOYE,
  Civilite,
  Piece,
} from '../../../../../models/model-users/employe.model';
import { ROLE } from '../../../../../models/model-users/role.model';

@Component({
  selector: 'app-add-employe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-employe.component.html',
  styleUrl: './add-employe.component.scss',
})
export class AddEmployeComponent implements OnInit {

  listEmployes: EMPLOYE[] = [];
  listRoles: ROLE[] = [];
  employeeForm!: FormGroup;
  employeeObj: EMPLOYE = new EMPLOYE();
  selectedPieceType: string = '';

  // Liste des types de pièces et genres
  pieces = [
    { value: 'CNIB', label: 'CNIB' },
    { value: 'PASSEPORT', label: 'PASSEPORT' },
  ];
  civilites = [
    { value: 'M', label: 'Monsieur' },
    { value: 'MME', label: 'Madame' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getRoles();
  }

  initializeForm(): void{
    this.employeeForm = this.formBuilder.group({
      matricule: [this.employeeObj.matricule || '', Validators.required],
      piece: [this.employeeObj.piece || '', Validators.required],
      numPiece: [this.employeeObj.numPiece || '', Validators.required],
      nip: [this.employeeObj.nip || ''],
      nom: [this.employeeObj.nom || '', Validators.required],
      prenom: [this.employeeObj.prenom || '', Validators.required],
      civilite: [this.employeeObj.civilite || '', Validators.required],
      email: [this.employeeObj.email, [Validators.required, Validators.email]],
      telephone: [this.employeeObj.telephone, Validators.required],
      role: [this.employeeObj.role || [], Validators.required],
      creationDate: [this.employeeObj.creationDate || new Date()],
      modifiedDate: [this.employeeObj.modifiedDate || new Date()],
      deleted: [this.employeeObj.deleted || false],
    });
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;
    const numPieceControl = this.employeeForm.get('numPiece');
  
    if (this.selectedPieceType === Piece.CNIB) {
      numPieceControl?.setValidators([Validators.required]);
      this.employeeForm.get('nip')?.setValidators([Validators.required]);
    } else if (this.selectedPieceType === Piece.PASSPORT) {
      numPieceControl?.setValidators([Validators.required]);
      this.employeeForm.get('nip')?.clearValidators();
    } else {
      // Si ce n'est ni CNIB ni PASSEPORT, on enlève les validateurs
      numPieceControl?.clearValidators();
      this.employeeForm.get('nip')?.clearValidators();
    }
  
    // Mettre à jour la validation après modification
    numPieceControl?.updateValueAndValidity();
    this.employeeForm.get('nip')?.updateValueAndValidity();
  }

  onRoleChange(event: any): void {
    const roleId = event.target.value;
    this.employeeForm.patchValue({
      role: roleId,
    });
  }

  getRoles() {
    this.http.get<ROLE[]>('http://localhost:2028/roles/all').subscribe({
      next: (res) => {
        this.listRoles = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des roles', err);
      },
    });
  }

  Save(): void {
    if (this.employeeForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
  
    const newEmploye: EMPLOYE = { ...this.employeeForm.getRawValue() };

    console.log("Données envoyées au backend :", newEmploye);
  
    if (newEmploye.piece === Piece.CNIB && (!newEmploye.numPiece || !newEmploye.nip)) {
      alert('Le CNIB nécessite un numPiece et un nip.');
      return;
    } else if (newEmploye.piece === Piece.PASSPORT) {
      newEmploye.nip = '';
    }
  
    if (this.employeeObj.id) {
      this.updateEmploye(newEmploye);
    } else {
      this.createEmploye(newEmploye);
    }
  }

  createEmploye(employe: EMPLOYE) {
    this.http.post('http://localhost:2028/users/create', employe).subscribe({
      next: () => {
        alert('Employé ajouté avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de l’ajout de l'employé", err);
        alert('Une erreur est survenue.');
      },
    });
  }
  
  updateEmploye(employe: EMPLOYE) {
    this.http.put(`http://localhost:2028/users/update/${this.employeeObj.id}`, employe).subscribe({
      next: () => {
        alert('Employé mis à jour avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'employé", err);
        alert('Une erreur est survenue.');
      },
    });
  }

  Close(): void {
    this.activeModal.close();
  }
}

