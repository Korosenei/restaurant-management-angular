import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component'
import { PaginationComponent } from '../../composants/pagination/pagination.component'
import { DetailBanqueComponent } from '../../composants/page-list-detail/detail-banque/detail-banque.component'
import { NewBanqueComponent } from '../../composants/page-nouvel-element/new-banque/new-banque.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banque',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewBanqueComponent,
    DetailBanqueComponent,
    PaginationComponent
  ],
  templateUrl: './banque.component.html',
  styleUrl: './banque.component.scss'
})
export class BanqueComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewBanqueComponent, {
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
