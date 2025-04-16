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
  USER,
  RoleName,
  Civilite,
  Piece,
} from '../../../../../models/model-users/user.model';

@Component({
  selector: 'app-add-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-utilisateur.component.html',
  styleUrl: './add-utilisateur.component.scss'
})
export class AddUtilisateurComponent implements OnInit {

  listUsers: USER[] = [];
  userForm!: FormGroup;
  userObj: USER = new USER();
  selectedPieceType: string = '';

  // Liste des types de roles pièces et genres
  roles = [
    { value: 'USER', label: 'USER' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'CAISSIER', label: 'CAISSIER' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'AUTRE', label: 'AUTRE' },
  ];

  pieces = [
    { value: 'CNIB', label: 'CNIB' },
    { value: 'PASSPORT', label: 'PASSPORT' },
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
  }

  initializeForm(): void{
    this.userForm = this.formBuilder.group({
      matricule: [this.userObj.matricule || '', Validators.required],
      piece: [this.userObj.piece || '', Validators.required],
      numPiece: [this.userObj.numPiece || '', Validators.required],
      nip: [this.userObj.nip || ''],
      nom: [this.userObj.nom || '', Validators.required],
      prenom: [this.userObj.prenom || '', Validators.required],
      civilite: [this.userObj.civilite || '', Validators.required],
      email: [this.userObj.email, [Validators.required, Validators.email]],
      telephone: [this.userObj.telephone, Validators.required],
      role: [this.userObj.role || ''],
      agenceId: [this.userObj.agenceId || ''],
      creationDate: [this.userObj.creationDate || new Date()],
      modifiedDate: [this.userObj.modifiedDate || new Date()],
      deleted: [this.userObj.deleted || false],
    });
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;
    const numPieceControl = this.userForm.get('numPiece');

    if (this.selectedPieceType === Piece.CNIB) {
      numPieceControl?.setValidators([Validators.required]);
      this.userForm.get('nip')?.setValidators([Validators.required]);
    } else if (this.selectedPieceType === Piece.PASSPORT) {
      numPieceControl?.setValidators([Validators.required]);
      this.userForm.get('nip')?.clearValidators();
    } else {
      // Si ce n'est ni CNIB ni PASSEPORT, on enlève les validateurs
      numPieceControl?.clearValidators();
      this.userForm.get('nip')?.clearValidators();
    }

    // Mettre à jour la validation après modification
    numPieceControl?.updateValueAndValidity();
    this.userForm.get('nip')?.updateValueAndValidity();
  }

  Save(): void {
    if (this.userForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const newUser: USER = { ...this.userForm.getRawValue() };

    console.log("🛠 Données envoyées au backend :", newUser);

    if (newUser.piece === Piece.CNIB && (!newUser.numPiece || !newUser.nip)) {
      alert('Le CNIB nécessite un numPiece et un nip.');
      return;
    } else if (newUser.piece === Piece.PASSPORT) {
      newUser.nip = '';
    }

    if (this.userObj.id) {
      this.updateUser(newUser);
    } else {
      this.createUser(newUser);
    }
  }

  createUser(user: USER) {
    this.http.post('http://localhost:2028/users/create', user).subscribe({
      next: () => {
        alert('Utilisateur ajouté avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de l’ajout de l'utilisateur", err);
        alert('Une erreur est survenue.');
      },
    });
  }

  updateUser(user: USER) {
    this.http.put(`http://localhost:2028/users/update/${this.userObj.id}`, user).subscribe({
      next: () => {
        alert('Utilisateur mis à jour avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur", err);
        alert('Une erreur est survenue.');
      },
    });
  }

  Close(): void {
    this.activeModal.close();
  }
}
