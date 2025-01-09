import { Component, OnInit } from '@angular/core';
import { CLUB } from '../../page-nouvel-service/new-club/club.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewClubComponent } from '../../page-nouvel-service/new-club/new-club.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-club',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-club.component.html',
  styleUrl: './detail-club.component.scss'
})
export class DetailClubComponent implements OnInit {
  // Objet CLUB
  clubObj: CLUB = new CLUB();
  listClubs: CLUB[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getClubs();
  }

  getClubs() {
    this.http.get<CLUB[]>('http://localhost:3000/clubs').subscribe({
      next: (res) => {
        this.listClubs = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des clubs", err);
      }
    });
  }

  onEdite(data: CLUB) {
    const modalRef = this.modalService.open(NewClubComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.clubObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des clubs
          this.getClubs(); // Recharger la liste des clubs depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Ce club sera supprimé après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer le club à supprimer
      const clubToDelete = this.listClubs.find((club) => club.id === id);

      if (clubToDelete) {
        // Ajouter le club à la collection deletedClub
        this.http
          .post<CLUB>('http://localhost:3000/deleteClub', clubToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le club de la liste active
              this.listClubs = this.listClubs.filter((club) => club.id !== id);

              // Optionnel : Vous pouvez supprimer le club de la collection originale si vous le souhaitez
              this.http
                .delete<CLUB>(`http://localhost:3000/clubs/${id}`)
                .subscribe({
                  next: () => {
                    alert('CLUB supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression du club dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement du club vers deletedClub',
                err
              );
            },
          });
      } else {
        alert("Le club n'a pas été trouvé.");
      }
    } else {
      alert('La suppression du club est annulée.');
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
