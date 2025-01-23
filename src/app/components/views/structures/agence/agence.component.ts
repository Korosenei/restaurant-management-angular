import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddAgenceComponent } from '../../../pages/page-add/add-structures/add-agence/add-agence.component';
import { ListAgenceComponent } from '../../../pages/page-list/list-structures/list-agence/list-agence.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-agence',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddAgenceComponent,
    ListAgenceComponent,
    PaginationComponent,
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss'
})
export class AgenceComponent {
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddAgenceComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
