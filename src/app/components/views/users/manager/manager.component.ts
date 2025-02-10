import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddManagerComponent } from '../../../pages/page-add/add-users/add-manager/add-manager.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddManagerComponent,
    PaginationComponent
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent {
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddManagerComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
