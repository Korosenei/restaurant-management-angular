import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { DetailDemandeComponent } from '../../composants/page-list-detail/detail-demande/detail-demande.component';
import { NewDemandeComponent } from '../../composants/page-nouvel-element/new-demande/new-demande.component'
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PaginationComponent } from "../../composants/pagination/pagination.component";

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewDemandeComponent,
    DetailDemandeComponent,
    PaginationComponent
  ],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.scss'
})
export class DemandeComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewDemandeComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
