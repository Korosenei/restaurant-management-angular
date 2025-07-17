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
import { AGENCE } from '../../../../../models/model-structures/agence.model';
import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';
import { USER } from '../../../../../models/model-users/user.model';
import { PROGRAMME } from '../../../../../models/model-restos/programme.model';

@Component({
  selector: 'app-add-programme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-programme.component.html',
  styleUrl: './add-programme.component.scss',
})
export class AddProgrammeComponent implements OnInit {
  programmeForm!: FormGroup;
  programmeObj: PROGRAMME = new PROGRAMME();

  listAgences: AGENCE[] = [];
  listRestaurants: RESTAURANT[] = [];
  listEmployes: USER[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployes();
    this.getAgences();
    this.getRestaurants();
  }

  initializeForm(): void {
    this.programmeForm = this.formBuilder.group({
      startDate: [this.programmeObj.startDate || '', Validators.required],
      endDate: [this.programmeObj.endDate || '', Validators.required],
      agence: [this.programmeObj.agence?.id, Validators.required],
      resto: [this.programmeObj.resto?.id, Validators.required],
      actif: [this.programmeObj.actif || true],
      creationDate: [this.programmeObj.creationDate || new Date()],
      modifiedDate: [this.programmeObj.modifiedDate || new Date()],
      deleted: [this.programmeObj.isDeleted || false],
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

  getAgences() {
    this.http.get<AGENCE[]>('http://localhost:2025/agences/all').subscribe({
      next: (res) => {
        this.listAgences = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des agences', err);
      },
    });
  }

  getRestaurants() {
    this.http.get<RESTAURANT[]>('http://localhost:2026/restos/all').subscribe({
      next: (res) => {
        this.listRestaurants = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants', err);
      },
    });
  }

  onAgenceChange(event: any): void {
    const agenceId = event.target.value;
    this.programmeForm.patchValue({
        agence: agenceId,
      });
  }

  onRestaurantChange(event: any): void {
    const restaurantId = event.target.value;
    this.programmeForm.patchValue({
        resto: restaurantId,
      });
  }

  Save() {
    if (this.programmeForm.invalid) {
      this.programmeForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const formValue = this.programmeForm.getRawValue();

    const newProgramme: PROGRAMME = {
      ...formValue,
      creationDate: new Date(formValue.creationDate).toISOString(),
      modifiedDate: new Date().toISOString(),
      agence: this.listAgences.find((a) => a.id == formValue.agence),
      resto: this.listRestaurants.find((r) => r.id == formValue.resto),
    };

    if (this.programmeObj.id) {
      this.updateProgramme(newProgramme);
    } else {
      this.createProgramme(newProgramme);
    }
  }

  createProgramme(programme: PROGRAMME) {
    this.http
      .post('http://localhost:2025/passages/create', programme)
      .subscribe({
        next: () => {
          alert('Programme ajouté avec succès !');

          /* const responsableId = this.agenceForm.value.responsable;
        if (responsableId) {
          this.assignAgenceToUser(responsableId, agence.id);
        } */

          this.activeModal.close('updated');
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du programme', err);
          alert('Une erreur est survenue.');
        },
      });
  }

  updateProgramme(programme: PROGRAMME) {
    this.http
      .put(
        `http://localhost:2025/agences/update/${this.programmeObj.id}`,
        programme
      )
      .subscribe({
        next: () => {
          alert('Programme mis à jour avec succès !');

          /* const agenceId = this.programmeForm.value.agence;
          const restaurantId = this.programmeForm.value.resto;

          if (agenceId) {
            this.assignAgenceToUser(agenceId, this.programmeObj.id);
          } */

          this.activeModal.close('updated');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du programme', err);
          alert('Une erreur est survenue.');
        },
      });
  }

  Close(): void {
    this.activeModal.close();
  }
}
