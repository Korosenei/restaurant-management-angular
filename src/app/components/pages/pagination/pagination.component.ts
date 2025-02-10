import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() collectionSize: number = 0; // Nombre total d'éléments
  @Input() pageSize: number = 5; // Nombre d'éléments par page
  @Input() page: number = 1; // Page actuelle

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.pageChange.emit(this.page);
  }

}
