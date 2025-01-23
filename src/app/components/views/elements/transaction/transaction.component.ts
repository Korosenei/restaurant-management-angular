import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddTransactionComponent } from '../../../pages/page-add/add-elements/add-transaction/add-transaction.component';
import { ListTransactionComponent } from '../../../pages/page-list/list-elements/list-transaction/list-transaction.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    ButtonActionComponent,
    AddTransactionComponent,
    ListTransactionComponent,
    PaginationComponent,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {

  constructor(private router: Router, private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(AddTransactionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
