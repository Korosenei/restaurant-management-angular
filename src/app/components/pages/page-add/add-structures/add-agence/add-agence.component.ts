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
import { AGENCE } from '../../../../../models/model-structures/agence.model';
import { USER } from '../../../../../models/model-users/user.model';

@Component({
  selector: 'app-add-agence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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
      code: [this.agenceObj.code || '', Validators.required],
      nom: [this.agenceObj.nom || '', Validators.required],
      sigle: [this.agenceObj.sigle || '', Validators.required],
      ville: [this.agenceObj.ville || '', Validators.required],
      directionDto: [this.agenceObj.directionDto, Validators.required],
      passageDtos: [this.agenceObj.passageDtos || []],
      responsable: [this.agenceObj.responsable?.id || null],
      creationDate: [this.agenceObj.creationDate || new Date()],
      modifiedDate: [this.agenceObj.modifiedDate || new Date()],
      deleted: [this.agenceObj.deleted || false],
    });

    //this.generateAgenceCode();
  }

  /* generateAgenceCode(): void {
    this.http.get<AGENCE[]>('http://localhost:2025/agences/all').subscribe({
      next: (agences: AGENCE[]) => {
        if (agences.length > 0) {
          const lastAgence = agences.sort((a, b) => {
            const codeA = parseInt(a.code.replace('AG-', ''), 10);
            const codeB = parseInt(b.code.replace('AG-', ''), 10);
            return codeB - codeA;
          })[0];

          const lastCodeNumber = parseInt(
            lastAgence.code.replace('AG-', ''),
            10
          );
          const newCodeNumber = (lastCodeNumber + 1)
            .toString()
            .padStart(3, '0');
          this.generatedAgenceCode = `AG-${newCodeNumber}`;
        } else {
          // Si aucune agence n'existe, commencer à 'AG-001'
          this.generatedAgenceCode = 'AG-001';
        }

        // Mettre à jour le champ du formulaire avec le code généré
        this.agenceForm.get('code')?.setValue(this.generatedAgenceCode);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des agences', err);
        alert('Erreur lors de la génération du code agence.');
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
    const employeId = event.target.value;
    this.agenceForm.patchValue({
      responsable: employeId,
    });
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
        //code: this.generatedAgenceCode,
        directionDto: this.agenceForm.value.directionDto,
        responsable: { id: this.agenceForm.value.responsable },
      };

      console.log('🛠 Données envoyées au backend :', newAgence);

      if (this.agenceObj.id) {
        this.updateAgence(newAgence);
      } else {
        this.createAgence(newAgence);
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  createAgence(agence: AGENCE) {
    this.http.post('http://localhost:2025/agences/create', agence).subscribe({
      next: () => {
        alert('Agence ajoutée avec succès !');

        const responsableId = this.agenceForm.value.responsable;
        if (responsableId) {
          this.assignAgenceToUser(responsableId, agence.id);
        }

        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la agence', err);
        alert('Une erreur est survenue.');
      },
    });
  }

  updateAgence(agence: AGENCE) {
    this.http
      .put(`http://localhost:2025/agences/update/${this.agenceObj.id}`, agence)
      .subscribe({
        next: () => {
          alert('Agence mis à jour avec succès !');

          const responsableId = this.agenceForm.value.responsable;
          if (responsableId) {
            this.assignAgenceToUser(responsableId, this.agenceObj.id);
          }

          this.activeModal.close('updated');
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour de l'agence", err);
          alert('Une erreur est survenue.');
        },
      });
  }

  assignAgenceToUser(userId: number, agenceId: number) {
    const url = `http://localhost:2028/users/patch/${userId}`;

    const updatePayload = {
      agenceId: agenceId,
    };

    this.http.patch(url, updatePayload).subscribe({
      next: () => {
        console.log(
          `✅ L'utilisateur ${userId} a été lié à l'agence ${agenceId}`
        );
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour de l’utilisateur', err);
      },
    });
  }

  Close(): void {
    this.activeModal.close();
  }
}
