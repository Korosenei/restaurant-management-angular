import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DEMANDE } from '../../page-nouvel-element/new-demande/demande.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeDetailModalComponent } from '../../button-detail/demande-detail-modal/demande-detail-modal.component'
import { NewDemandeComponent } from '../../page-nouvel-element/new-demande/new-demande.component';
import { CLIENT } from '../../page-nouvel-user/new-client/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-demande',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-demande.component.html',
  styleUrl: './detail-demande.component.scss'
})
export class DetailDemandeComponent implements OnInit {

  // Objet DEMANDE
  demandeObj: DEMANDE = new DEMANDE();
  listDemandes: DEMANDE[] = [];
  selectedDemande: DEMANDE | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getDemandes();
  }

  getDemandes() {
    this.http.get<DEMANDE[]>('http://localhost:3000/demandes').subscribe({
      next: (res) => {
        this.listDemandes = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des demandes", err);
      }
    });
  }

  onDetail(demande: DEMANDE) {
    const modalRef = this.modalService.open(DemandeDetailModalComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.demande = demande;

    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

  onEdite(data: DEMANDE) {
    const modalRef = this.modalService.open(NewDemandeComponent,{size: 'lg',});
    modalRef.componentInstance.demandeObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des demandes
          this.getDemandes(); // Recharger la liste des demandes depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Cette demande sera supprimée après confirmation !!! '
    );
    if (isDelete) {
      // Récupérer la demande à supprimer
      const demandeToDelete = this.listDemandes.find((demande) => demande.id === id);

      if (demandeToDelete) {
        // Ajouter la demande à la collection deletedDemande
        this.http
          .post<DEMANDE>('http://localhost:3000/deleteDemande', demandeToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer la demande de la liste active
              this.listDemandes = this.listDemandes.filter((demande) => demande.id !== id);

              // Optionnel : Vous pouvez supprimer la demande de la collection originale si vous le souhaitez
              this.http
                .delete<DEMANDE>(`http://localhost:3000/demandes/${id}`)
                .subscribe({
                  next: () => {
                    alert('DEMANDE supprimée de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression de la demande dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement de la demande vers deletedDemande',
                err
              );
            },
          });
      } else {
        alert("La demande n'a pas été trouvée.");
      }
    } else {
      alert('La suppression de la demande est annulée.');
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
