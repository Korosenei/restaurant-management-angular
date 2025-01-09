import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      HttpClientModule,
    ]
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder:FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      matricule: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    
    const matricule = this.loginForm.get('matricule')?.value;
    const email = this.loginForm.get('email')?.value;
  
    this.http.get<any>(`http://localhost:3000/employes?matricule=${matricule}&email=${email}`)
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            console.log('Connexion réussie, redirection vers le dashboard...');
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Matricule ou email incorrect.';
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données', error);
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      );
  }
  
  onForgotPasswordClick() {
    this.router.navigate(['/recover']);
  }

}
