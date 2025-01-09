import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonActionComponent } from "../../composants/button-action/button-action.component";
import { PaginationComponent } from "../../composants/pagination/pagination.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailGerantComponent } from '../../composants/page-list-detail/detail-gerant/detail-gerant.component';
import { NewGerantComponent } from '../../composants/page-nouvel-user/new-gerant/new-gerant.component';

@Component({
  selector: 'app-gerant',
  standalone: true,
  imports: [
    ButtonActionComponent,
    NewGerantComponent,
    DetailGerantComponent,
    PaginationComponent
],
  templateUrl: './gerant.component.html',
  styleUrl: './gerant.component.scss'
})
export class GerantComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(NewGerantComponent, { size: 'lg',
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
