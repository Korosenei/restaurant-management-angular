import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../composants/pagination/pagination.component';
import { ButtonActionComponent } from '../../composants/button-action/button-action.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailEmployeComponent } from '../../composants/page-list-detail/detail-employe/detail-employe.component';
import { NewEmployeComponent } from '../../composants/page-nouvel-user/new-employe/new-employe.component';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewEmployeComponent,
    DetailEmployeComponent,
    PaginationComponent
  ],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.scss',
})
export class EmployeComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewEmployeComponent, { size: 'lg',
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
