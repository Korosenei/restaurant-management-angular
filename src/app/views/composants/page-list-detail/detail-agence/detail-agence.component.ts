import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AGENCE } from '../../page-nouvel-service/new-agence/agence.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAgenceComponent } from '../../page-nouvel-service/new-agence/new-agence.component';

@Component({
  selector: 'app-detail-agence',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-agence.component.html',
  styleUrl: './detail-agence.component.scss'
})
export class DetailAgenceComponent implements OnInit {
  // Objet AGENCE
  agenceObj: AGENCE = new AGENCE();
  listAgences: AGENCE[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAgences();
  }

  getAgences() {
    this.http.get<AGENCE[]>('http://localhost:3000/agences').subscribe({
      next: (res) => {
        this.listAgences = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des agences", err);
      }
    });
  }

  onEdite(data: AGENCE) {
    const modalRef = this.modalService.open(NewAgenceComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.agenceObj = { ...data }; // Passer les données au modal

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getAgences(); // Recharger la liste des banques depuis le serveur après la mise à jour
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm('Cette agence sera supprimée après confirmation !!! ');
    if (isDelete) {
      const agenceToDelete = this.listAgences.find((agence) => agence.id === id);
      if (agenceToDelete) {
        this.http.post<AGENCE>('http://localhost:3000/deleteAgence', agenceToDelete).subscribe({
          next: () => {
            this.listAgences = this.listAgences.filter((agence) => agence.id !== id);
            this.http.delete<AGENCE>(`http://localhost:3000/agences/${id}`).subscribe({
              next: () => {
                alert('AGENCE supprimée de la liste active avec succès');
              },
              error: (err) => {
                console.error('Erreur lors de la suppression de l\'agence dans la collection originale', err);
              },
            });
          },
          error: (err) => {
            console.error('Erreur lors du déplacement de l\'agence vers deletedAgence', err);
          },
        });
      } else {
        alert("La banque n'a pas été trouvée.");
      }
    } else {
      alert('La suppression de la banque est annulée.');
    }
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('Key down', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key up', event.key);
  }
}
