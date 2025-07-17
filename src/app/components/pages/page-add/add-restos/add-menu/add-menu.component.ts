import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, of } from 'rxjs';

import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';
import { MENU } from '../../../../../models/model-restos/menu.model';
import { USER } from '../../../../../models/model-users/user.model';
import { AuthService } from '../../../../../services/auth-service/auth.service';
import { MenuService } from '../../../../../services/service-restos/menu-service/menu.service';
import { RestaurantService } from '../../../../../services/service-restos/resto-service/restaurant.service';

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

  currentUser: USER | null = null;
  userRestaurant: RESTAURANT | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  @Input() menuItem?: MENU;
  @Input() weekNumber: number = 30;
  @Input() year: number = 2025;

  isEditMode: boolean = false;
  isLoading: boolean = false;
  isDataLoaded: boolean = false;

  weekDates: { date: Date; day: string; disabled: boolean }[] = [];

  private readonly DAY_NAMES = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.generateWeekDates();
    this.setDefaultDate();
    this.loadCurrentUserAndRestaurant();

    if (this.menuItem) {
      this.isEditMode = true;
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.menuForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      quantite: [
        1,
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      image: [''],
      isDisponible: [true],
      dateJour: ['', Validators.required],
      creationDate: [new Date()],
      modifiedDate: [new Date()],
      isDeleted: [false],
    });
  }

  private loadCurrentUserAndRestaurant(): void {
    this.isLoading = true;
    this.isDataLoaded = false;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.showError('Utilisateur non connecté');
      this.isLoading = false;
      return;
    }

    this.authService.getUserById(userId).subscribe({
      next: (user) => {
        this.currentUser = user;

        const allowedRoles = ['ADMIN', 'MANAGER'];
        if (!allowedRoles.includes(user.role)) {
          this.showError(
            'Accès refusé. Seuls les administrateurs et managers peuvent créer des menus.'
          );
          this.isLoading = false;
          return;
        }

        if (user.role === 'MANAGER') {
          this.getUserRestaurant(user.id);
        } else {
          this.isLoading = false;
          this.isDataLoaded = true;
        }
      },
      error: (err) => {
        this.handleError(
          err,
          'Erreur lors de la récupération des informations utilisateur'
        );
      },
    });
  }

  private getUserRestaurant(managerId: number): void {
    this.restaurantService.getRestaurantByManager(managerId).subscribe({
      next: (restaurant) => {
        this.userRestaurant = restaurant;
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: (err) => {
        this.handleError(err, 'Aucun restaurant associé à ce manager');
      },
    });
  }

  private generateWeekDates(): void {
    const firstDayOfYear = new Date(this.year, 0, 1);
    const daysOffset = (this.weekNumber - 1) * 7;
    const firstDayOfWeek = new Date(
      firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000
    );

    const monday = new Date(firstDayOfWeek);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1);

    this.weekDates = this.DAY_NAMES.map((dayName, index) => {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + index);

      const isPast = currentDate < today;
      const isFutureWeek =
        currentDate >
        new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

      return {
        date: currentDate,
        day: dayName,
        disabled: isPast || isFutureWeek,
      };
    });
  }

  private setDefaultDate(): void {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todayAvailable = this.weekDates.find(
      (d) => d.date.toISOString().split('T')[0] === todayStr && !d.disabled
    );

    const defaultDate = todayAvailable
      ? todayStr
      : this.weekDates
          .find((d) => !d.disabled)
          ?.date.toISOString()
          .split('T')[0];

    if (defaultDate) {
      this.menuForm.patchValue({ dateJour: defaultDate });
    }
  }

  private populateForm(): void {
    if (this.menuItem) {
      this.menuForm.patchValue({
        nom: this.menuItem.nom,
        description: this.menuItem.description,
        quantite: this.menuItem.quantite,
        image: this.menuItem.image,
        isDisponible: this.menuItem.isDisponible,
        dateJour: this.menuItem.dateJour,
      });

      if (this.menuItem.image) {
        this.imagePreview = this.menuItem.imageUrl;
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.isValidImageFile(file)) {
        this.showError(
          'Format de fichier non supporté. Utilisez JPG, PNG ou GIF.'
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showError('Le fichier est trop volumineux. Taille maximum: 5MB.');
        return;
      }

      this.selectedFile = file;
      this.generateImagePreview(file);
    }
  }

  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    this.saveMenu(false);
  }

  onSaveAndAddNew(): void {
    this.saveMenu(true);
  }

  private saveMenu(addNewAfter: boolean): void {
    if (this.menuForm.invalid) {
      this.markFormGroupTouched(this.menuForm);
      return;
    }

    if (!this.currentUser) {
      this.showError('Utilisateur non connecté');
      return;
    }

    this.isLoading = true;
    const formValue = this.menuForm.value;

    // Préparer les données du menu
    const menuData = this.menuService.formatMenuData(
      formValue,
      this.currentUser,
      this.userRestaurant
    );

    // Valider les données avant envoi
    const validationErrors = this.menuService.validateMenuData(menuData);
    if (validationErrors.length > 0) {
      this.showError(validationErrors.join('\n'));
      this.isLoading = false;
      return;
    }

    const operation = this.isEditMode
      ? this.updateMenu(menuData)
      : this.createMenu(menuData);

    operation.subscribe({
      next: (response) => {
        this.handleSaveSuccess(response, addNewAfter);
      },
      error: (error) => {
        this.handleError(error, 'Erreur lors de la sauvegarde du menu');
      },
    });
  }

  private createMenu(menuData: any): Observable<any> {
    return this.menuService.create(menuData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du menu:', error);
        return of(null);
      })
    );
  }

  private updateMenu(menuData: any): Observable<any> {
    if (!this.menuItem?.id) {
      return of(null);
    }

    return this.menuService.update(this.menuItem.id, menuData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour du menu:', error);
        return of(null);
      })
    );
  }

  private handleSaveSuccess(response: any, addNewAfter: boolean): void {
    this.isLoading = false;

    if (!response) {
      this.showError('Erreur lors de la sauvegarde');
      return;
    }

    // Upload de l'image si nécessaire
    if (this.selectedFile && response.id) {
      this.uploadImage(response.id, addNewAfter);
    } else {
      this.completeSaveProcess(addNewAfter);
    }
  }

  private uploadImage(menuId: number, addNewAfter: boolean): void {
    if (!this.selectedFile) {
      this.completeSaveProcess(addNewAfter);
      return;
    }

    this.menuService.uploadImage(menuId, this.selectedFile).subscribe({
      next: () => {
        this.completeSaveProcess(addNewAfter);
      },
      error: (error) => {
        console.error("Erreur lors de l'upload de l'image:", error);
        // Continuer même si l'upload échoue
        this.completeSaveProcess(addNewAfter);
      },
    });
  }

  private completeSaveProcess(addNewAfter: boolean): void {
    const message = this.isEditMode
      ? 'Menu modifié avec succès'
      : 'Menu créé avec succès';
    this.showSuccess(message);

    if (addNewAfter) {
      this.resetForm();
    } else {
      this.activeModal.close({ success: true, action: 'save' });
    }
  }

  private resetForm(): void {
    this.menuForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.initializeForm();
    this.setDefaultDate();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.menuForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      const errors = field.errors;
      if (errors) {
        if (errors['required']) {
          return 'Ce champ est obligatoire';
        }
        if (errors['minlength']) {
          return `Minimum ${errors['minlength'].requiredLength} caractères`;
        }
        if (errors['min']) {
          return `Valeur minimum: ${errors['min'].min}`;
        }
        if (errors['max']) {
          return `Valeur maximum: ${errors['max'].max}`;
        }
      }
    }
    return null;
  }

  getSelectedDayName(): string {
    const selectedDate = this.menuForm.get('dateJour')?.value;
    if (!selectedDate) return '';

    const dateObj = new Date(selectedDate);
    const foundDate = this.weekDates.find(
      (d) => d.date.toISOString().split('T')[0] === selectedDate
    );

    return foundDate ? foundDate.day : '';
  }

  onClose(): void {
    this.activeModal.close({ success: false, action: 'cancel' });
  }

  private showError(message: string): void {
    console.error(message);
    // Ici vous pouvez ajouter une notification toast ou un autre système d'alerte
    alert(message);
  }

  private showSuccess(message: string): void {
    console.log(message);
    // Ici vous pouvez ajouter une notification toast ou un autre système d'alerte
    // alert(message);
  }

  private handleError(error: any, defaultMessage: string): void {
    this.isLoading = false;
    const errorMessage = error?.message || defaultMessage;
    this.showError(errorMessage);
  }
}
