import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormModule, ReactiveFormsModule],
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss',
})
export class ActivationComponent implements OnInit {

  activationStatus: string = 'Activation en cours...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.activateAccount(token);
      }
    });
  }

  activateAccount(token: string) {
    const apiUrl = `http://localhost:2028/auth/activate?token=${token}`;
    
    this.http.get(apiUrl).subscribe({
      next: () => {
        this.activationStatus = 'Compte activé avec succès ! Redirection en cours...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: err => {
        this.activationStatus = 'Échec de l’activation. Token invalide ou expiré.';
      }
    });
  }
}
