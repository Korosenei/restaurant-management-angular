import { Component, OnInit } from '@angular/core';
import { DIRECTION } from './direction.model';
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
import { EMPLOYE } from '../../page-nouvel-user/new-employe/employe.model';

@Component({
  selector: 'app-new-direction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './new-direction.component.html',
  styleUrl: './new-direction.component.scss',
})
export class NewDirectionComponent implements OnInit {
  // Objet DIRECTION
  listDirections: DIRECTION[] = [];
  directionForm!: FormGroup;
  directionObj: DIRECTION = new DIRECTION();

  // EMPLOYE
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
  }

  initializeForm(): void {
    this.directionForm = this.formBuilder.group({
      code: [this.directionObj, Validators.required],
      nom: [this.directionObj.nom, Validators.required],
      sigle: [this.directionObj.sigle, Validators.required],
      region: [this.directionObj.region, Validators.required],
      ville: [this.directionObj.ville, Validators.required],
      responsable: [this.directionObj.responsable, Validators.required],
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

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.directionForm.valid) {
      this.directionObj = { ...this.directionObj, ...this.directionForm.value }; // Met à jour directionObj avec les valeurs du formulaire

      let request$;

      if (this.directionObj.id) {
        // Mise à jour de la direction existante
        request$ = this.http.put<DIRECTION>(
          `http://localhost:3000/directions/${this.directionObj.id}`,
          this.directionObj
        );
      } else {
        // Création d'une nouvelle direction
        request$ = this.http.post<DIRECTION>(
          'http://localhost:3000/directions',
          this.directionObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `direction ${
              this.directionObj.id ? 'mise à jour' : 'créée'
            } avec succès`,
            res
          );
          this.activeModal.close(this.directionObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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
