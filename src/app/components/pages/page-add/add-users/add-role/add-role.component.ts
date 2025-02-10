import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { ROLE } from '../../../../../models/model-users/role.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss',
})
export class AddRoleComponent implements OnInit {
  roleForm!: FormGroup;
  roleObj: ROLE = new ROLE();

  roles = [
    { value: 'USER', label: 'USER' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'CAISSIER', label: 'CAISSIER' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'AUTRE', label: 'AUTRE' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.roleForm = this.formBuilder.group({
      name: [this.roleObj.name || '', Validators.required],
      label: [this.roleObj.label || '', Validators.required],
      creationDate: [this.roleObj.creationDate || new Date()],
      modifiedDate: [this.roleObj.modifiedDate || new Date()],
      deleted: [this.roleObj.deleted || false],
    });
  }

  Save(): void {
    if (this.roleForm.valid) {
      const newRole: ROLE = {
        ...this.roleForm.getRawValue(),
      };

      if (this.roleObj.id) {
        // Met à jour un rôle existant
        this.http
          .put(`http://localhost:2028/roles/update/${this.roleObj.id}`, newRole)
          .subscribe({
            next: () => {
              alert('Role mis à jour avec succès !');
              this.activeModal.close('updated');
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour du rôle', err);
              alert('Une erreur est survenue.');
            },
          });
      } else {
        // Création d'un nouveau rôle
        this.http
          .post('http://localhost:2028/roles/create', newRole)
          .subscribe({
            next: () => {
              alert('Role ajouté avec succès !');
              this.activeModal.close('updated');
            },
            error: (err) => {
              console.error('Erreur lors de l’ajout du rôle', err);
              alert('Une erreur est survenue.');
            },
          });
      }
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  Close(): void {
    this.activeModal.close();
  }
}
