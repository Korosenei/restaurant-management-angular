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
import { USER } from '../../../../../models/model-users/user.model';

@Component({
  selector: 'app-add-direction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-direction.component.html',
  styleUrl: './add-direction.component.scss',
})
export class AddDirectionComponent implements OnInit {
  listDirections: DIRECTION[] = [];
  directionForm!: FormGroup;
  directionObj: DIRECTION = new DIRECTION();
  generatedDirectionCode: string = '';

  listEmployes: USER[] = [];

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
      code: [{ value: '', disabled: true }],
      nom: [
        this.directionObj.nom || '',
        [Validators.required, Validators.minLength(3)],
      ],
      sigle: [this.directionObj.sigle || '', Validators.required],
      region: [this.directionObj.region, Validators.required],
      ville: [this.directionObj.ville, Validators.required],
      agenceDto: [this.directionObj.agenceDtos || null],
      userId: [this.directionObj.userId, Validators.required],
      responsable: [this.directionObj.responsable || null, Validators.required],
      creationDate: [this.directionObj.creationDate || new Date()],
      modifiedDate: [this.directionObj.modifiedDate || new Date()],
      deleted: [this.directionObj.deleted || false],
    });

    this.generateDirectionCode();
  }

  generateDirectionCode(): void {
    this.http
      .get<DIRECTION[]>('http://localhost:2025/directions/all')
      .subscribe({
        next: (directions: DIRECTION[]) => {
          if (directions.length > 0) {
            const lastDirection = directions.sort((a, b) => {
              const codeA = parseInt(a.code.replace('DR-', ''), 10);
              const codeB = parseInt(b.code.replace('DR-', ''), 10);
              return codeB - codeA;
            })[0];

            const lastCodeNumber = parseInt(
              lastDirection.code.replace('DR-', ''),
              10
            );
            const newCodeNumber = (lastCodeNumber + 1)
              .toString()
              .padStart(2, '0');
            this.generatedDirectionCode = `DR-${newCodeNumber}`;
          } else {
            // Si aucune direction n'existe, commencer à 'DR-01'
            this.generatedDirectionCode = 'DR-01';
          }

          // Mettre à jour le champ du formulaire avec le code généré
          this.directionForm.get('code')?.setValue(this.generatedDirectionCode);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des directions', err);
          alert('Erreur lors de la génération du code direction.');
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

  onEmployeChange(event: any): void {
    const userId = event.target.value;
    const selectedEmploye = this.listEmployes.find(
      (employe) => employe.matricule === userId
    );

    if (selectedEmploye) {
      const fullName = `${selectedEmploye.nom} ${selectedEmploye.prenom}`;

      this.directionForm.patchValue({
        responsable: fullName,
      });
    }
  }

  Save() {
    if (this.directionForm.valid) {
      const newDirection: DIRECTION = {
        ...this.directionForm.getRawValue(),
        code: this.generatedDirectionCode,
      };

      this.http
        .post('http://localhost:2025/directions/create', newDirection)
        .subscribe({
          next: () => {
            alert('Direction ajoutée avec succès !');
            this.directionForm.reset();
          },
          error: (err) => {
            console.error('Erreur lors de l’ajout de la direction', err);
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
