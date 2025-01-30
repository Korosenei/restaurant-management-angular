import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddAgenceComponent } from '../../../pages/page-add/add-structures/add-agence/add-agence.component';
import { ListAgenceComponent } from '../../../pages/page-list/list-structures/list-agence/list-agence.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agence',
  standalone: true,
  imports: [
    ButtonActionComponent,
    ListAgenceComponent,
    PaginationComponent,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss'
})
export class AgenceComponent {
  constructor(private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddAgenceComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
