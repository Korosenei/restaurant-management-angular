import { Component, Input } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { USER } from '../../../../models/model-users/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  @Input() user!: USER; // Reçoit l'objet user à afficher

  constructor(private http: HttpClient, public activeModal: NgbActiveModal) {}

  toggleEnabled(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.user.enabled = checked;

    this.http
      .put(`http://localhost:2028/users/${id}/enabled?enabled=${checked}`, null)
      .subscribe({
        next: (response) => {
          console.log('Statut modifié :', response);
        },
        error: (error) => {
          console.error('Erreur :', error);
          this.user.enabled = !checked; // Annule le changement en cas d'erreur
        },
      });
  }

  Close(): void {
    this.activeModal.close();
  }
}
