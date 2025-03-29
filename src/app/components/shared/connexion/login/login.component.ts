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
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      matricule: ['', Validators.required],
      motDePasse: ['', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.loginForm.get('matricule')?.invalid) {
      this.errorMessage = 'Veuillez saisir votre matricule.';
      return;
    }
    if (this.loginForm.get('motDePasse')?.invalid) {
      this.errorMessage = 'Veuillez saisir votre mot de passe.';
      return;
    }

    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);

          // Récupérer les informations de l'utilisateur avec le matricule
          const matricule = this.loginForm.get('matricule')?.value;
          this.authService.getUserInfoByMatricule(matricule).subscribe({
            next: (user) => {
              const { nom, prenom } = user;
              console.log('Connexion réussie !', user);
              console.log('Utilisateur récupéré :', user);
              // Stocker les informations de l'utilisateur dans le localStorage
              localStorage.setItem('user', JSON.stringify(user));

              // Message de succès
              this.successMessage = `Connexion réussie ! Bienvenue ${prenom} ${nom}.`;

              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 2000); // Redirection après 2 secondes
            },
            error: (err) => {
              this.errorMessage =
                "Impossible de récupérer les informations de l'utilisateur.";
            },
          });
        },
        error: (err) => {
          console.error('Échec de la connexion', err)
          this.errorMessage = 'Identifiant ou mot de passe incorrect.';
        }
      });
    }
  }

  onForgotPasswordClick() {
    this.router.navigate(['/recover']);
  }
}
