import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { DetailChequeComponent } from '../../composants/page-list-detail/detail-cheque/detail-cheque.component';
import { PaginationComponent } from '../../composants/pagination/pagination.component'
import { NewChequeComponent } from '../../composants/page-nouvel-element/new-cheque/new-cheque.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cheque',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewChequeComponent,
    DetailChequeComponent,
    PaginationComponent
],
  templateUrl: './cheque.component.html',
  styleUrl: './cheque.component.scss'
})
export class ChequeComponent {
  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewChequeComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
