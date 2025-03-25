import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  // URL du backend
  apiUrl = 'http://localhost:2028/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      matricule: ['', Validators.required],
      motDePasse: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    const loginData = {
      matricule: this.loginForm.value.matricule,
      motDePasse: this.loginForm.value.motDePasse,
    };
  
    this.http.post<{ token: string, user: any }>(this.apiUrl, loginData).subscribe({
      next: (response) => {
        // Stocker le token et les infos de l'utilisateur dans le localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user)); 
        console.log('Connexion réussie !', response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        alert('Échec de la connexion. Vérifiez vos identifiants.');
      },
    });
  }
}
