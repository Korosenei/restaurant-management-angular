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
  selector: 'app-add-direction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-direction.component.html',
  styleUrl: './add-direction.component.scss'
})
export class AddDirectionComponent implements OnInit {
  listDirections: DIRECTION[] = [];
  directionForm!: FormGroup;
  directionObj: DIRECTION = new DIRECTION();

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
      code: [this.directionObj.code, Validators.required],
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
      this.directionObj = { ...this.directionObj, ...this.directionForm.value };

      let request$;

      if (this.directionObj.id) {
        request$ = this.http.put<DIRECTION>(
          `http://localhost:3000/directions/${this.directionObj.id}`,
          this.directionObj
        );
      } else {
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
          this.activeModal.close(this.directionObj.id ? 'updated' : 'created');
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
