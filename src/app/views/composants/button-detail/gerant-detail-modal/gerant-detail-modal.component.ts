import { Component, Input } from '@angular/core';
import { GERANT } from '../../page-nouvel-user/new-gerant/gerant.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gerant-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './gerant-detail-modal.component.html',
  styleUrl: './gerant-detail-modal.component.scss'
})
export class GerantDetailModalComponent {

  @Input() gerant!: GERANT;  // Reçoit l'objet gérant à afficher

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  Close(): void {
    this.activeModal.close();
  }
}
