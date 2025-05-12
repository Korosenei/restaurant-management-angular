import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DIRECTION } from '../../../../../models/model-structures/direction.model';
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
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployes();
  }

  initializeForm(): void {
    this.directionForm = this.formBuilder.group({
      code: [this.directionObj.code || '', Validators.required],
      nom: [this.directionObj.nom || '', Validators.required],
      sigle: [this.directionObj.sigle || '', Validators.required],
      region: [this.directionObj.region, Validators.required],
      ville: [this.directionObj.ville, Validators.required],
      agenceDto: [this.directionObj.agenceDtos || null],
      responsable: [this.directionObj.responsable?.id || null],
      creationDate: [this.directionObj.creationDate || new Date()],
      modifiedDate: [this.directionObj.modifiedDate || new Date()],
      deleted: [this.directionObj.deleted || false],
    });

    //this.generateDirectionCode();
  }

  /* generateDirectionCode(): void {
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
  } */

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
    const employeId = event.target.value;
    this.directionForm.patchValue({
      responsable: employeId,
    });
  }

  Save() {
    if (this.directionForm.valid) {
      const newDirection: DIRECTION = {
        ...this.directionForm.getRawValue(),
        responsable: { id: this.directionForm.value.responsable },
        //code: this.generatedDirectionCode,
      };

      console.log('🛠 Données envoyées au backend :', newDirection);

      if (this.directionObj.id) {
        this.updateDirection(newDirection);
      }
      else {
        this.createDirection(newDirection);
      }
    }
    else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  createDirection(direction: DIRECTION) {
    this.http.post('http://localhost:2025/directions/create', direction).subscribe({
      next: () => {
        alert('Direction ajoutée avec succès !');

        /* const responsableId = this.directionForm.value.responsable;
        if (responsableId) {
          this.assignDirectionToUser(responsableId, direction.id);
        } */

        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de l’ajout de la direction", err);
        alert('Une erreur est survenue.');
      },
    });
  }

  updateDirection(direction: DIRECTION) {
    this.http.put(`http://localhost:2025/directions/update/${this.directionObj.id}`, direction).subscribe({
      next: () => {
        alert('Direction mis à jour avec succès !');

        /* const responsableId = this.directionForm.value.responsable;
        if (responsableId) {
          this.assignDirectionToUser(responsableId, this.directionObj.id);
        } */

        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la direction", err);
        alert('Une erreur est survenue.');
      },
    });
  }

  /* assignDirectionToUser(userId: number, directionId: number) {
    const url = `http://localhost:2028/users/patch/${userId}`;

    const updatePayload = {
      directionId: directionId
    };

    this.http.patch(url, updatePayload).subscribe({
      next: () => {
        console.log(`✅ L'utilisateur ${userId} a été lié à la direction ${directionId}`);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour de l’utilisateur', err);
      }
    });
  } */

  Close(): void {
    this.activeModal.close();
  }
}
