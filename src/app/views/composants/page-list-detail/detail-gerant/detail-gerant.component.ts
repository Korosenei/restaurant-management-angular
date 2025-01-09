import { Component, OnInit } from '@angular/core';
import { GERANT } from '../../page-nouvel-user/new-gerant/gerant.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GerantDetailModalComponent } from '../../button-detail/gerant-detail-modal/gerant-detail-modal.component';
import { NewGerantComponent } from '../../page-nouvel-user/new-gerant/new-gerant.component';

@Component({
  selector: 'app-detail-gerant',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './detail-gerant.component.html',
  styleUrl: './detail-gerant.component.scss'
})
export class DetailGerantComponent implements OnInit  {
  // Objet Gerant
  gerantObj: GERANT = new GERANT();
  listGerants: GERANT[] = [];
  selectedGerant: GERANT | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getGerants();
  }

  getGerants() {
    this.http.get<GERANT[]>('http://localhost:3000/gerants').subscribe({
      next: (res) => {
        this.listGerants = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des gérants", err);
      }
    });
  }

  onDetail(gerant: GERANT) {
    const modalRef = this.modalService.open(GerantDetailModalComponent, { 
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.gerant = gerant;
  
    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }
  

  onEdite(data: GERANT) {
    const modalRef = this.modalService.open(NewGerantComponent, { size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    })
    modalRef.componentInstance.gerantObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des gerants
          this.getGerants(); // Recharger la liste des gerants depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  // Méthode pour supprimer un gerant
  onDelete(id: number) {
    const gerantToDelete = this.listGerants.find((gerant) => gerant.id === id);
    if (!gerantToDelete) {
      alert("Le gerant n'a pas été trouvé.");
      return;
    }
    // Récupérer le gerant à supprimer
    const isDelete = confirm(`Êtes-vous sûr de vouloir supprimer le gerant ${gerantToDelete.nom} ${gerantToDelete.prenom} ?`);

    if (isDelete) {

      if (gerantToDelete) {
        // Ajouter le gerant à la collection deletedGerant
        this.http
          .post<GERANT>('http://localhost:3000/deleteGerant', gerantToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le gerant de la liste active
              this.listGerants = this.listGerants.filter(
                (gerant) => gerant.id !== id
              );

              // Optionnel : Vous pouvez supprimer le gerant de la collection originale si vous le souhaitez
              this.http
                .delete<GERANT>(`http://localhost:3000/gerants/${id}`)
                .subscribe({
                  next: () => {
                    alert('GERANT supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression du gerant dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement du gerant vers deletedGerant",
                err
              );
            },
          });
      } else {
        alert("Le gerant n'a pas été trouvé.");
      }
    } else {
      alert("La suppression du gerant est annulé.");
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
