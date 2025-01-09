import { Component, Input } from '@angular/core';
import { DEMANDE } from '../../page-nouvel-element/new-demande/demande.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demande-detail-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './demande-detail-modal.component.html',
  styleUrl: './demande-detail-modal.component.scss',
})
export class DemandeDetailModalComponent {
  @Input() demande!: DEMANDE;

  constructor(public activeModal: NgbActiveModal) {}

  Close(): void {
    this.activeModal.close();
  }
}
