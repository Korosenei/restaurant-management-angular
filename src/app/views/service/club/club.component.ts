import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { NewClubComponent } from '../../composants/page-nouvel-service/new-club/new-club.component'
import { DetailClubComponent } from '../../composants/page-list-detail/detail-club/detail-club.component';
import { PaginationComponent } from '../../composants/pagination/pagination.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-club',
  standalone: true,
  imports: [
    ButtonActionComponent,
    PaginationComponent,
    NewClubComponent,
    DetailClubComponent
  ],
  templateUrl: './club.component.html',
  styleUrl: './club.component.scss'
})
export class ClubComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewClubComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });
  }
}
