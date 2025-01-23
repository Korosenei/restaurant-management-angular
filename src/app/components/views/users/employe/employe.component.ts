import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddEmployeComponent } from '../../../pages/page-add/add-users/add-employe/add-employe.component';
import { ListEmployeComponent } from '../../../pages/page-list/list-users/list-employe/list-employe.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddEmployeComponent,
    ListEmployeComponent,
    PaginationComponent
  ],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.scss'
})
export class EmployeComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal
  ){}

  openModal(){
    this.modalService.open(AddEmployeComponent, { size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }
}
