import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddMenuComponent } from '../../../pages/page-add/add-restos/add-menu/add-menu.component';
import { ListMenuComponent } from '../../../pages/page-list/list-restos/list-menu/list-menu.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddMenuComponent,
    ListMenuComponent,
    PaginationComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
