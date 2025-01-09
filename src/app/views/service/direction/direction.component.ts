import { Component } from '@angular/core';
import { PaginationComponent } from '../../composants/pagination/pagination.component';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { NewDirectionComponent } from '../../composants/page-nouvel-service/new-direction/new-direction.component'
import { DetailDirectionComponent } from '../../composants/page-list-detail/detail-direction/detail-direction.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [
    ButtonActionComponent,
    PaginationComponent,
    NewDirectionComponent,
    DetailDirectionComponent
  ],
  templateUrl: './direction.component.html',
  styleUrl: './direction.component.scss'
})
export class DirectionComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewDirectionComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
