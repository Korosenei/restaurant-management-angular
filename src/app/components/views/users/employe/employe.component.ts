import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddEmployeComponent } from '../../../pages/page-add/add-users/add-employe/add-employe.component';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddEmployeComponent
  ],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.scss'
})
export class EmployeComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(AddEmployeComponent, { size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
