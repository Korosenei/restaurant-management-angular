import { Component } from '@angular/core';
import { DetailRegistreComponent } from '../../composants/page-list-detail/detail-registre/detail-registre.component';
import { NewRegistreComponent } from '../../composants/page-nouvel-element/new-registre/new-registre.component'
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PaginationComponent } from "../../composants/pagination/pagination.component";

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewRegistreComponent,
    DetailRegistreComponent,
    PaginationComponent
  ],
  templateUrl: './registre.component.html',
  styleUrl: './registre.component.scss'
})
export class RegistreComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewRegistreComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
