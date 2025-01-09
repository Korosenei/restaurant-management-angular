import { Component, OnInit } from '@angular/core';
import { DIRECTION } from '../../page-nouvel-service/new-direction/direction.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewDirectionComponent } from '../../page-nouvel-service/new-direction/new-direction.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-direction',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-direction.component.html',
  styleUrl: './detail-direction.component.scss'
})
export class DetailDirectionComponent implements OnInit {
  // Objet DIRECTION
  directionObj: DIRECTION = new DIRECTION();
  listDirections: DIRECTION[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getDirections();
  }

  getDirections() {
    this.http.get<DIRECTION[]>('http://localhost:3000/directions').subscribe({
      next: (res) => {
        this.listDirections = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des directions", err);
      }
    });
  }

  onEdite(data: DIRECTION) {
    const modalRef = this.modalService.open(NewDirectionComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.directionObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des directions
          this.getDirections(); // Recharger la liste des directions depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Cette direction sera supprimée après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer la direction à supprimer
      const directionToDelete = this.listDirections.find((direction) => direction.id === id);

      if (directionToDelete) {
        // Ajouter la direction à la collection deletedDirection
        this.http
          .post<DIRECTION>('http://localhost:3000/deleteDirection', directionToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le cheque de la liste active
              this.listDirections = this.listDirections.filter((direction) => direction.id !== id);

              // Optionnel : Vous pouvez supprimer la direction de la collection originale si vous le souhaitez
              this.http
                .delete<DIRECTION>(`http://localhost:3000/directions/${id}`)
                .subscribe({
                  next: () => {
                    alert('DIRECTION supprimée de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression de la direction dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement de la direction vers deletedDirection',
                err
              );
            },
          });
      } else {
        alert("La direction n'a pas été trouvée.");
      }
    } else {
      alert('La suppression de la direction est annulée.');
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
