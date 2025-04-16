import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../services/auth-service/auth.service';

@Component({
  selector: 'app-pwd-forgeted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './pwd-forgeted.component.html',
  styleUrl: './pwd-forgeted.component.scss'
})
export class PwdForgetedComponent implements OnInit{
  pwdResetForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.pwdResetForm = this.formBuilder.group({
      matricule: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.pwdResetForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const { matricule, email } = this.pwdResetForm.value;

    this.authService.forgotPassword({ matricule, email }).subscribe({
      next: () => {
        this.successMessage = 'Instructions envoyées pour réinitialiser votre mot de passe.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Rediriger après 2 secondes
      },
      error: (err) => {
        this.errorMessage = 'Impossible de traiter votre demande. Veuillez vérifier vos informations.';
      }
    });
  }

  onConnexionClick() {
    this.router.navigate(['/login']);
  }
}
