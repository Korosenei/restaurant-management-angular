import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { DetailAgenceComponent } from '../../composants/page-list-detail/detail-agence/detail-agence.component';
import { NewAgenceComponent } from '../../composants/page-nouvel-service/new-agence/new-agence.component'
import { PaginationComponent } from '../../composants/pagination/pagination.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agence',
  standalone: true,
  imports: [
    ButtonActionComponent,
    PaginationComponent,
    NewAgenceComponent,
    DetailAgenceComponent
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss'
})
export class AgenceComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewAgenceComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
