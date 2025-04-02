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
import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';
import { MENU } from '../../../../../models/model-restos/menu.model';

@Component({
  selector: 'app-add-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-menu.component.html',
  styleUrl: './add-menu.component.scss',
})
export class AddMenuComponent implements OnInit {
  listMenus: MENU[] = [];
  menuForm!: FormGroup;
  menuObj: MENU = new MENU();
  generatedMenuCode: string = '';

  listRestaurants: RESTAURANT[] = [];
  selectedImage: File | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getRestaurants();
  }

  initializeForm(): void {
    this.menuForm = this.formBuilder.group({
      nom: [this.menuObj.nom || '',Validators.required],
      description: [this.menuObj.description || '', Validators.required],
      image: [this.menuObj.image || '', Validators.required],
      restaurantId: [this.menuObj.restaurant ? this.menuObj.restaurant.id : null, Validators.required],
      restaurant: [this.menuObj.restaurant || null, Validators.required],
      creationDate: [this.menuObj.creationDate || new Date()],
      modifiedDate: [this.menuObj.modifiedDate || new Date()],
      deleted: [this.menuObj.deleted || false],
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

  onRestaurantChange(event: any): void {
    const restaurantId = event.target.value;
    const selectedRestaurant = this.listRestaurants.find(
      (restaurant) => restaurant.id === restaurantId
    );

    if (selectedRestaurant) {
      this.menuForm.patchValue({
        restaurant: selectedRestaurant,
      });
    }
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.menuForm.patchValue({
          image: e.target.result, // Optionally, if you want to store it as base64 or a file URL
        });
      };
      reader.readAsDataURL(file); // Converts the image to a base64 string
    }
  }

  Save() {
    if (this.menuForm.valid) {
      const newMenu: MENU = {
        ...this.menuForm.getRawValue(),
      };

      const formData = new FormData();
      formData.append('menu', JSON.stringify(newMenu)); // Append the menu data
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name); // Append the image file
      }

      this.http.post('http://localhost:2026/menus/create', formData).subscribe({
        next: () => {
          alert('Menu ajouté avec succès !');
          this.menuForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du menu', err);
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
