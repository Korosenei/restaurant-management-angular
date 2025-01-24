import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DIRECTION } from '../../../../../models/model-structures/direction.model';
import { AGENCE } from '../../../../../models/model-structures/agence.model';
import { EMPLOYE } from '../../../../../models/model-users/employe.model';

@Component({
  selector: 'app-add-agence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-agence.component.html',
  styleUrl: './add-agence.component.scss',
})
export class AddAgenceComponent implements OnInit {
  listAgences: AGENCE[] = [];
  agenceForm!: FormGroup;
  agenceObj: AGENCE = new AGENCE();

  listDirections: DIRECTION[] = [];
  listEmployes: EMPLOYE[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployes();
    this.getDirections();
  }

  initializeForm(): void {
    this.agenceForm = this.formBuilder.group({
      code: [this.agenceObj.code, Validators.required],
      nom: [this.agenceObj.nom, Validators.required],
      sigle: [this.agenceObj.sigle, Validators.required],
      ville: [this.agenceObj.ville, Validators.required],
      responsable: [this.agenceObj.responsable, Validators.required],
      direction: [this.agenceObj.direction, Validators.required],
    });
  }

  getEmployes() {
    this.http.get<EMPLOYE[]>('http://localhost:3000/employes').subscribe({
      next: (res) => {
        this.listEmployes = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés', err);
      },
    });
  }

  getDirections() {
    this.http.get<DIRECTION[]>('http://localhost:3000/directions').subscribe({
      next: (res) => {
        this.listDirections = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des directions', err);
      },
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.agenceForm.valid) {
      this.agenceObj = { ...this.agenceObj, ...this.agenceForm.value };

      let request$;

      if (this.agenceObj.id) {
        request$ = this.http.put<AGENCE>(
          `http://localhost:3000/agences/${this.agenceObj.id}`,
          this.agenceObj
        );
      } else {
        request$ = this.http.post<AGENCE>(
          'http://localhost:3000/agences',
          this.agenceObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `ticket ${this.agenceObj.id ? 'mise à jour' : 'créée'} avec succès`,
            res
          );
          this.activeModal.close(this.agenceObj.id ? 'updated' : 'created');
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
