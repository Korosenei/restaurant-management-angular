import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { REGISTRE } from '../../page-nouvel-element/new-registre/registre.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRegistreComponent } from '../../page-nouvel-element/new-registre/new-registre.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-registre',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-registre.component.html',
  styleUrl: './detail-registre.component.scss'
})
export class DetailRegistreComponent  implements OnInit {
  // Objet REGISTRE
  listRegistres: REGISTRE[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getRegistres();
  }

  getRegistres() {
    this.http.get<REGISTRE[]>('http://localhost:3000/registres').subscribe({
      next: (res) => {
        this.listRegistres = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des registres", err);
      }
    });
  }

  /* getClubs() {
    this.http.get<CLUB[]>('http://localhost:3000/clubs').subscribe({
      next: (res) => {
        this.listClubs = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des clubs", err);
      }
    });
  } */

  onEdite(data: REGISTRE) {
    const modalRef = this.modalService.open(NewRegistreComponent);
    modalRef.componentInstance.registreObj= { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des registres
          this.getRegistres(); // Recharger la liste des registres depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Ce registre sera supprimé après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer du registres à supprimer
      const registreToDelete = this.listRegistres.find((registre) => registre.id === id);

      if (registreToDelete) {
        // Ajouter le registre à la collection deletedRegistre
        this.http
          .post<REGISTRE>('http://localhost:3000/deleteRegistre', registreToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le registre de la liste active
              this.listRegistres = this.listRegistres.filter((registre) => registre.id !== id);

              // Optionnel : Vous pouvez supprimer le registre de la collection originale si vous le souhaitez
              this.http
                .delete<REGISTRE>(`http://localhost:3000/registres/${id}`)
                .subscribe({
                  next: () => {
                    alert('REGISTRE supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression du registre dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement du registre vers deletedRegistre',
                err
              );
            },
          });
      } else {
        alert("Le registre n'a pas été trouvée.");
      }
    } else {
      alert('La suppression du registre est annulée.');
    }
  }
}
