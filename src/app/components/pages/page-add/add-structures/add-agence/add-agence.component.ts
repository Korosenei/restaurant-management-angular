import { Component, Input, OnInit } from '@angular/core';
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
import { USER } from '../../../../../models/model-users/user.model';

@Component({
  selector: 'app-add-agence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-agence.component.html',
  styleUrl: './add-agence.component.scss',
})
export class AddAgenceComponent implements OnInit {
  agenceForm!: FormGroup;
  agenceObj: AGENCE = new AGENCE();
  generatedAgenceCode: string = '';

  listDirections: DIRECTION[] = [];
  listEmployes: USER[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployes();
    this.getDirections();
  }

  initializeForm(): void {
    this.agenceForm = this.formBuilder.group({
      code: [{ value: '', disabled: true }],
      nom: [
        this.agenceObj.nom || '',
        [Validators.required, Validators.minLength(3)],
      ],
      sigle: [this.agenceObj.sigle || '', Validators.required],
      ville: [this.agenceObj.ville || '', Validators.required],
      directionDto: [this.agenceObj.directionDto || [], Validators.required],
      passageDtos: [this.agenceObj.passageDtos || []],
      userId: [this.agenceObj.userId, Validators.required],
      responsable: [this.agenceObj.responsable || null, Validators.required],
      creationDate: [this.agenceObj.creationDate || new Date()],
      modifiedDate: [this.agenceObj.modifiedDate || new Date()],
      deleted: [this.agenceObj.deleted || false],
    });

    this.generateAgenceCode();
  }

  generateAgenceCode(): void {
    this.http.get<AGENCE[]>('http://localhost:2025/agences/all').subscribe({
      next: (agences: AGENCE[]) => {
        if (agences.length > 0) {
          const lastAgence = agences.sort((a, b) => {
            const codeA = parseInt(a.code.replace('AGE-', ''), 10);
            const codeB = parseInt(b.code.replace('AGE-', ''), 10);
            return codeB - codeA;
          })[0];

          const lastCodeNumber = parseInt(
            lastAgence.code.replace('AGE-', ''),
            10
          );
          const newCodeNumber = (lastCodeNumber + 1)
            .toString()
            .padStart(4, '0');
          this.generatedAgenceCode = `AGE-${newCodeNumber}`;
        } else {
          // Si aucune agence n'existe, commencer à 'AGE-0001'
          this.generatedAgenceCode = 'AGE-0001';
        }

        // Mettre à jour le champ du formulaire avec le code généré
        this.agenceForm.get('code')?.setValue(this.generatedAgenceCode);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des agences', err);
        alert('Erreur lors de la génération du code agence.');
      },
    });
  }

  getEmployes() {
    this.http.get<USER[]>('http://localhost:2028/users/all').subscribe({
      next: (res) => {
        this.listEmployes = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés', err);
      },
    });
  }

  getDirections() {
    this.http
      .get<DIRECTION[]>('http://localhost:2025/directions/all')
      .subscribe({
        next: (res) => {
          this.listDirections = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des directions', err);
        },
      });
  }

  onEmployeChange(event: any): void {
    const userId = event.target.value;
    const selectedEmploye = this.listEmployes.find(
      (employe) => employe.matricule === userId
    );

    if (selectedEmploye) {
      const fullName = `${selectedEmploye.nom} ${selectedEmploye.prenom}`;

      this.agenceForm.patchValue({
        responsable: fullName,
      });
    }
  }

  onDirectionChange(event: any): void {
    const directionId = event.target.value;
    const selectedDirection = this.listDirections.find(
      (direction) => direction.id == directionId
    );

    if (selectedDirection) {
      this.agenceForm.patchValue({
        directionDto: selectedDirection,
      });
    }
  }

  Save() {
    if (this.agenceForm.valid) {
      const newAgence: AGENCE = {
        ...this.agenceForm.getRawValue(),
        code: this.generatedAgenceCode,
        directionDto: this.agenceForm.value.directionDto,
      };

      this.http
        .post('http://localhost:2025/agences/create', newAgence)
        .subscribe({
          next: () => {
            alert('Agence ajoutée avec succès !');
            this.agenceForm.reset();
          },
          error: (err) => {
            console.error("Erreur lors de l’ajout de l'agence", err);
            alert('Une erreur est survenue.');
          },
        });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
    this.activeModal.close();
  }

  Close(): void {
    this.activeModal.close();
  }
}

