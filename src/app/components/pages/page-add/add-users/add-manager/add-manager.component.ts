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
  MANAGER,
  Genre,
  TypePiece,
} from '../../../../../models/model-users/manager.model';

@Component({
  selector: 'app-add-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-manager.component.html',
  styleUrl: './add-manager.component.scss',
})
export class AddManagerComponent implements OnInit {
  listManagers: MANAGER[] = [];
  managerForm!: FormGroup;
  managerObj: MANAGER = new MANAGER();
  selectedPieceType: string = '';

  readonly typePieces = Object.values(TypePiece);
  readonly genres = Object.values(Genre);

  pieceTypes = [
    { value: 'CNIB', label: 'CNIB' },
    { value: 'PASSEPORT', label: 'PASSEPORT' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.managerForm = this.formBuilder.group({
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
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;

    if (this.selectedPieceType === TypePiece.CNIB) {
      this.managerForm.get('numCnib')?.setValidators([Validators.required]);
      this.managerForm.get('numPassport')?.clearValidators();
    } else if (this.selectedPieceType === TypePiece.PASSPORT) {
      this.managerForm.get('numPassport')?.setValidators([Validators.required]);
      this.managerForm.get('numCnib')?.clearValidators();
    }

    this.managerForm.get('numCnib')?.updateValueAndValidity();
    this.managerForm.get('numPassport')?.updateValueAndValidity();
  }

  Save() {
      if (this.managerForm.valid) {
        const managerObj: MANAGER = this.managerForm.value;

        if (managerObj.typePiece === TypePiece.CNIB) {
          managerObj.numPassport = '';
        } else if (managerObj.typePiece === TypePiece.PASSPORT) {
          managerObj.numCnib = '';
          managerObj.nipCnib = '';
        }

        const request$ = managerObj.id
          ? this.http.put<MANAGER>(
              `http://localhost:3000/managers/${managerObj.id}`,
              managerObj
            )
          : this.http.post<MANAGER>('http://localhost:3000/managers', managerObj);

        request$.subscribe({
          next: (res) => {
            console.log(
              `Manager ${managerObj.id ? 'mise à jour' : 'créé'} avec succès`,
              res
            );
            this.activeModal.close(managerObj.id ? 'updated' : 'created');
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
