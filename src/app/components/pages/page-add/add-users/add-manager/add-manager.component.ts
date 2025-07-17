import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  USER,
  RoleName,
  Civilite,
  Piece,
} from '../../../../../models/model-users/user.model';
import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';

@Component({
  selector: 'app-add-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-manager.component.html',
  styleUrl: './add-manager.component.scss',
})
export class AddManagerComponent implements OnInit {
  listManagers: USER[] = [];
  listRestaurants: RESTAURANT[] = [];
  managerForm!: FormGroup;
  managerObj: USER = new USER();
  selectedPieceType: string = '';

  // Liste des types de pièces
  pieces = [
    { value: Piece.CNIB, label: 'CNIB' },
    { value: Piece.PASSPORT, label: 'Passeport' },
  ];

  // Liste des civilités - Utilise les bonnes valeurs enum
  civilites = [
    { value: Civilite.M, label: 'Monsieur' },
    { value: Civilite.MME, label: 'Madame' },
  ];

  // Liste des rôles (pour référence, mais non utilisée dans le template)
  roles = [
    { value: RoleName.USER, label: 'USER' },
    { value: RoleName.ADMIN, label: 'ADMIN' },
    { value: RoleName.MANAGER, label: 'MANAGER' },
    { value: RoleName.CAISSIER, label: 'CAISSIER' },
    { value: RoleName.CLIENT, label: 'CLIENT' },
    { value: RoleName.AUTRE, label: 'AUTRE' },
  ];

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
    // Génération automatique du matricule
    const generatedMatricule = this.generateManagerMatricule();

    this.managerForm = this.formBuilder.group({
      matricule: [{ value: generatedMatricule, disabled: true }],
      piece: [this.managerObj.piece || '', Validators.required],
      numPiece: [this.managerObj.numPiece || '', Validators.required],
      nip: [this.managerObj.nip || ''],
      nom: [this.managerObj.nom || '', Validators.required],
      prenom: [this.managerObj.prenom || '', Validators.required],
      civilite: [this.managerObj.civilite || '', Validators.required],
      email: [this.managerObj.email, [Validators.required, Validators.email]],
      telephone: [this.managerObj.telephone, Validators.required],
      role: [{ value: RoleName.MANAGER, disabled: true }],
      restoId: [this.managerObj.restoId || null, Validators.required],
      enabled: [true],
      accountLocked: [false],
    });
  }

  /**
   * Génère un matricule automatique pour le manager
   * Format: MAN@GERXXXX où XXXX est un nombre aléatoire de 4 chiffres
   */
  generateManagerMatricule(): string {
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MAN@GER${randomNumber}`;
  }

  getRestaurants() {
    this.http
      .get<RESTAURANT[]>('http://localhost:2026/restos/all')
      .subscribe({
        next: (res) => {
          this.listRestaurants = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des restaurants', err);
        },
      });
  }

  onRestaurantChange(event: any): void {
    const restaurantId = parseInt(event.target.value);
    const selectedRestaurant = this.listRestaurants.find(
      (restaurant) => restaurant.id === restaurantId
    );

    if (selectedRestaurant) {
      this.managerForm.patchValue({
        restoId: selectedRestaurant.id,
      });
    }
  }

  onPieceTypeChange(event: any) {
    this.selectedPieceType = event.target.value;

    // Réinitialiser les validateurs
    this.managerForm.get('numPiece')?.clearValidators();
    this.managerForm.get('nip')?.clearValidators();

    if (this.selectedPieceType === Piece.CNIB) {
      this.managerForm.get('numPiece')?.setValidators([Validators.required]);
      this.managerForm.get('nip')?.setValidators([Validators.required]);
    } else if (this.selectedPieceType === Piece.PASSPORT) {
      this.managerForm.get('numPiece')?.setValidators([Validators.required]);
      // Pour le passeport, le NIP n'est pas requis
    }

    this.managerForm.get('numPiece')?.updateValueAndValidity();
    this.managerForm.get('nip')?.updateValueAndValidity();
  }

  Save(): void {
    if (this.managerForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    // Récupération des valeurs du formulaire (y compris les champs disabled)
    const formValue = this.managerForm.getRawValue();

    const newManager: USER = {
      ...formValue,
      role: RoleName.MANAGER, // Force le rôle à MANAGER
      matricule: formValue.matricule, // Inclure le matricule généré
    };

    console.log("🛠 Données envoyées au backend :", newManager);

    // Validation spécifique selon le type de pièce
    if (newManager.piece === Piece.CNIB && (!newManager.numPiece || !newManager.nip)) {
      alert('Le CNIB nécessite un numPiece et un nip.');
      return;
    } else if (newManager.piece === Piece.PASSPORT) {
      newManager.nip = ''; // Vider le NIP pour les passeports
    }

    // Validation du restaurant
    if (!newManager.restoId) {
      alert('Veuillez sélectionner un restaurant.');
      return;
    }

    if (this.managerObj.id) {
      this.updateUser(newManager);
    } else {
      this.createUser(newManager);
    }
  }

  createUser(user: USER) {
    this.http.post('http://localhost:2028/users/create', user).subscribe({
      next: () => {
        alert('Manager ajouté avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du manager", err);
        alert('Une erreur est survenue lors de la création du manager.');
      },
    });
  }

  updateUser(user: USER) {
    this.http.put(`http://localhost:2028/users/update/${this.managerObj.id}`, user).subscribe({
      next: () => {
        alert('Manager mis à jour avec succès !');
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du manager", err);
        alert('Une erreur est survenue lors de la mise à jour du manager.');
      },
    });
  }

  Close(): void {
    this.activeModal.close();
  }
}
