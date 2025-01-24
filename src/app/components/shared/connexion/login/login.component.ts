import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      matricule: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { matricule, password, rememberMe } = this.loginForm.value;
      console.log('Formulaire envoyé:', matricule, password, rememberMe);
      this.router.navigate(['/#']);
    }
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
