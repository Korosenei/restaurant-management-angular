import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  // URL du backend
  apiUrl = 'http://localhost:2028/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      matricule: ['', Validators.required],
      motDePasse: ['', Validators.required]
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

    this.http.post<{ token: string }>(this.apiUrl, loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Stocker le token
        console.log('Connexion réussie ! Token:', response.token);
        this.router.navigate(['/dashboard']);
        this.activeModal.close();
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        alert('Échec de la connexion. Vérifiez vos identifiants.');
      },
    });
  }

  openRecoveryModal() {
    console.log('Ouverture du modal de récupération de mot de passe');
  }

  /* openRecoveryModal(){
    this.modalService.open(PwdForgetedComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
 */
  Close(): void {
    this.activeModal.close();
  }

  onLoginClick() {
    this.activeModal.close();
    this.router.navigate(['/#']);
  }
}
