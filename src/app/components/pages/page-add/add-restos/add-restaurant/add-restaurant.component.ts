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
import { USER } from '../../../../../models/model-users/user.model';
import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.scss',
})
export class AddRestaurantComponent implements OnInit {
  listRestaurants: RESTAURANT[] = [];
  restaurantForm!: FormGroup;
  restaurantObj: RESTAURANT = new RESTAURANT();
  generatedRestaurantCode: string = '';

  listManagers: USER[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getManagers();
  }

  initializeForm(): void {
    this.restaurantForm = this.formBuilder.group({
      code: [{ value: '', disabled: true }],
      nom: [this.restaurantObj.nom || '', Validators.required],
      ville: [this.restaurantObj.ville || '', Validators.required],
      telephone: [this.restaurantObj.telephone || 0, Validators.required,],
      menuDtos: [this.restaurantObj.menuDtos || '', Validators.required],
      manager: [this.restaurantObj.manager || null, Validators.required],
      creationDate: [this.restaurantObj.creationDate || new Date()],
      modifiedDate: [this.restaurantObj.modifiedDate || new Date()],
      deleted: [this.restaurantObj.deleted || false],
    });
    this.generateRestaurantCode();
  }

  generateRestaurantCode(): void {
    this.http.get<RESTAURANT[]>('http://localhost:2026/restos/all').subscribe({
      next: (restaurants: RESTAURANT[]) => {
        if (restaurants.length > 0) {
          const lastRestaurant = restaurants.sort((a, b) => {
            const codeA = parseInt(a.code.replace('RES-', ''), 10);
            const codeB = parseInt(b.code.replace('RES-', ''), 10);
            return codeB - codeA;
          })[0];

          const lastCodeNumber = parseInt(lastRestaurant.code.replace('RES-', ''), 10);
          const newCodeNumber = (lastCodeNumber + 1).toString().padStart(2, '0');
          this.generatedRestaurantCode = `RES-${newCodeNumber}`;
        } else {
          this.generatedRestaurantCode = 'RES-01';
        }

        this.restaurantForm.get('code')?.setValue(this.generatedRestaurantCode);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants', err);
        alert('Erreur lors de la génération du code restaurant.');
      },
    });
  }

  getManagers() {
    this.http.get<USER[]>('http://localhost:2028/users/filter/role/MANAGER').subscribe({
      next: (res) => {
        this.listManagers = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des managers', err);
      },
    });
  }

  onManagerChange(event: any): void {
    const userId = event.target.value;
    const selectedManager = this.listManagers.find(
      (manager) => manager.id === userId
    );

    if (selectedManager) {
      const fullName = `${selectedManager.nom} ${selectedManager.prenom}`;

      this.restaurantForm.patchValue({
        manager: fullName,
      });
    }
  }

  Save() {
    if (this.restaurantForm.valid) {
      const newRestaurant: RESTAURANT = {
        ...this.restaurantForm.getRawValue(),
        code: this.generatedRestaurantCode,
      };

      this.http.post('http://localhost:2026/restos/create', newRestaurant).subscribe({
        next: () => {
          alert('Restaurant ajouté avec succès !');
          this.restaurantForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du restaurant', err);
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
