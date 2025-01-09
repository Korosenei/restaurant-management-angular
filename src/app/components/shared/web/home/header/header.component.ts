import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../../connexion/login/login.component'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ) {}

  onHomeClick() {
    this.router.navigate(['/home']);
  }
  onMenuClick() {
    this.router.navigate(['/menu']);
  }
  onRestoClick() {
    this.router.navigate(['/resto']);
  }
  onContactClick() {
    this.router.navigate(['/contact']);
  }

  openLoginModal(){
    this.modalService.open(LoginComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
