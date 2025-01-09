import { Component} from '@angular/core';
import { PaginationComponent } from "../../composants/pagination/pagination.component";
import { ButtonActionComponent } from "../../composants/button-action/button-action.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailClientComponent } from '../../composants/page-list-detail/detail-client/detail-client.component';
import { NewClientComponent } from '../../composants/page-nouvel-user/new-client/new-client.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewClientComponent,
    DetailClientComponent,
    PaginationComponent
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewClientComponent, { size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('Key down', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key up', event.key);
  }
}
