import { Component, Input } from '@angular/core';
import { CLIENT } from '../../page-nouvel-user/new-client/client.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './client-detail-modal.component.html',
  styleUrl: './client-detail-modal.component.scss'
})
export class ClientDetailModalComponent {
  
  @Input() client!: CLIENT;  // Reçoit l'objet client à afficher

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  Close(): void {
    this.activeModal.close();
  }
}
