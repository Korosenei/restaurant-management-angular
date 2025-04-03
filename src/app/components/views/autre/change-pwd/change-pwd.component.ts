import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CHANGEPWD } from '../../../../models/model-users/ChangePwd.model';
import { USER } from '../../../../models/model-users/user.model';

@Component({
  selector: 'app-change-pwd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.scss',
})
export class ChangePwdComponent implements OnInit {
  @Input() currentUser!: USER; // Utilisateur connecté passé par le modal
  changePwdForm!: FormGroup;
  errors: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    console.log('Utilisateur reçu dans le modal :', this.currentUser);
  }

  initializeForm(): void {
    this.changePwdForm = this.formBuilder.group(
      {
        lastPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;

    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  save() {
    if (!this.currentUser) {
      alert('Utilisateur non trouvé !');
      return;
    }

    if (this.changePwdForm.valid) {
      const formValue = this.changePwdForm.value;
      const changePwdDto = {
        lastPassword: formValue.lastPassword,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmNewPassword,
        modifiedDate: new Date(),
      };

      console.log('Changement de mot de passe à envoyer:', changePwdDto);

      this.http
        .put(
          `http://localhost:2028/users/update-password?matricule=${this.currentUser.matricule}`,
          changePwdDto,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .subscribe(
          () => {
            alert('Mot de passe mis à jour avec succès!');
            this.activeModal.close('updated');
          },
          (error) => {
            console.error('Erreur lors du changement de mot de passe : ', error);
            this.errors = error.error;
          }
        );
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  Close(): void {
    this.activeModal.close();
  }
}
