import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
openRecoveryModal() {
throw new Error('Method not implemented.');
}

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

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
}
