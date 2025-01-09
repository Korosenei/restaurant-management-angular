import { Component, Input } from '@angular/core';
import { EMPLOYE } from '../../page-nouvel-user/new-employe/employe.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employe-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './employe-detail-modal.component.html',
  styleUrl: './employe-detail-modal.component.scss'
})
export class EmployeDetailModalComponent {

  @Input() employe!: EMPLOYE;  // Reçoit l'objet employé à afficher

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  Close(): void {
    this.activeModal.close();
  }
}
