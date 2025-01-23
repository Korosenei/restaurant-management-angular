import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddDirectionComponent } from '../../../pages/page-add/add-structures/add-direction/add-direction.component';
import { ListDirectionComponent } from '../../../pages/page-list/list-structures/list-direction/list-direction.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddDirectionComponent,
    ListDirectionComponent,
    PaginationComponent,
  ],
  templateUrl: './direction.component.html',
  styleUrl: './direction.component.scss'
})
export class DirectionComponent {
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddDirectionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
