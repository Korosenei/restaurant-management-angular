import { Component } from '@angular/core';
import { DetailTicketComponent } from '../../composants/page-list-detail/detail-ticket/detail-ticket.component';
import { NewTicketComponent } from '../../composants/page-nouvel-element/new-ticket/new-ticket.component'
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PaginationComponent } from "../../composants/pagination/pagination.component";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewTicketComponent,
    DetailTicketComponent,
    PaginationComponent
],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewTicketComponent, {
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
