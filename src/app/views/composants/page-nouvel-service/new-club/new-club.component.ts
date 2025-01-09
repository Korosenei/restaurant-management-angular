import { Component, OnInit } from '@angular/core';
import { CLUB } from './club.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GERANT } from '../../page-nouvel-user/new-gerant/gerant.model';
import { AGENCE } from '../new-agence/agence.model';

@Component({
  selector: 'app-new-club',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-club.component.html',
  styleUrl: './new-club.component.scss'
})
export class NewClubComponent implements OnInit{

  // Objet CLUB
  listClubs: CLUB[] = [];
  clubForm!: FormGroup;
  clubObj: CLUB = new CLUB();

  // GERANT & AGENCE
  listGerants: GERANT[] = [];
  listAgences: AGENCE[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getGerants();
    this.getAgences();
  }

  initializeForm(): void{
    this.clubForm = this.formBuilder.group({
      code: [this.clubObj.code, Validators.required],
      nom: [this.clubObj.nom, Validators.required],
      ville: [this.clubObj.ville, Validators.required],
      localite: [this.clubObj.localite, Validators.required],
      gerant: [this.clubObj.gerant, Validators.required],
      agence: [this.clubObj.agence, Validators.required],
  });
  }

  getGerants() {
    this.http.get<GERANT[]>('http://localhost:3000/gerants').subscribe({
      next: (res) => {
        this.listGerants = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des gerants", err);
      }
    });
  }

  getAgences() {
    this.http.get<AGENCE[]>('http://localhost:3000/agences').subscribe({
      next: (res) => {
        this.listAgences = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des agences", err);
      }
    });
  }

  Close(): void {
    this.activeModal.close();
  }

  Save() {
    if (this.clubForm.valid) {
      this.clubObj = { ...this.clubObj, ...this.clubForm.value }; // Met à jour clubObj avec les valeurs du formulaire

      let request$;

      if (this.clubObj.id) {
        // Mise à jour du club existant
        request$ = this.http.put<CLUB>(
          `http://localhost:3000/clubs/${this.clubObj.id}`,
          this.clubObj
        );
      } else {
        // Création d'un nouvel club
        request$ = this.http.post<CLUB>(
          'http://localhost:3000/clubs',
          this.clubObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `club ${
              this.clubObj.id ? 'mise à jour' : 'créée'
            } avec succès`,
            res
          );
          this.activeModal.close(this.clubObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
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
