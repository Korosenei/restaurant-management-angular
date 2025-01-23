import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddRestaurantComponent } from '../../../pages/page-add/add-restos/add-restaurant/add-restaurant.component';
import { ListRestaurantComponent } from '../../../pages/page-list/list-restos/list-restaurant/list-restaurant.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddRestaurantComponent,
    ListRestaurantComponent,
    PaginationComponent,
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
})
export class RestaurantComponent {
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddRestaurantComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
