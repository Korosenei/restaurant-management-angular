import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddTicketComponent } from '../../../pages/page-add/add-elements/add-ticket/add-ticket.component';
import { ListTicketComponent } from '../../../pages/page-list/list-elements/list-ticket/list-ticket.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddTicketComponent,
    ListTicketComponent,
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
      this.modalService.open(AddTicketComponent, { size: 'lg',
        backdrop: 'static', // Désactive la fermeture en cliquant en dehors
        keyboard: false    // Désactive la fermeture avec la touche 'Échap'
      });
    }
}
