import { Component, OnInit } from '@angular/core';
import { CLIENT } from '../../page-nouvel-user/new-client/client.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientDetailModalComponent } from '../../button-detail/client-detail-modal/client-detail-modal.component';
import { NewClientComponent } from '../../page-nouvel-user/new-client/new-client.component';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.scss'
})
export class DetailClientComponent implements OnInit  {
  // Objet Client
  clientObj: CLIENT = new CLIENT();
  listClients: CLIENT[] = [];
  selectedClient: CLIENT | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.http.get<CLIENT[]>('http://localhost:3000/clients').subscribe({
      next: (res) => {
        this.listClients = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des clients", err);
      }
    });
  }

  onDetail(client: CLIENT) {
    const modalRef = this.modalService.open(ClientDetailModalComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.client = client;

    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }


  onEdite(data: CLIENT) {
    const modalRef = this.modalService.open(NewClientComponent, { size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    })
    modalRef.componentInstance.clientObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des clients
          this.getClients(); // Recharger la liste des clients depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  // Méthode pour supprimer un client
  onDelete(id: number) {
    const clientToDelete = this.listClients.find((client) => client.id === id);
    if (!clientToDelete) {
      alert("Le client n'a pas été trouvé.");
      return;
    }
    // Récupérer le client à supprimer
    const isDelete = confirm(`Êtes-vous sûr de vouloir supprimer le client ${clientToDelete.nom} ${clientToDelete.prenom} ?`);

    if (isDelete) {

      if (clientToDelete) {
        // Ajouter le client à la collection deletedClient
        this.http
          .post<CLIENT>('http://localhost:3000/deleteClient', clientToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer le client de la liste active
              this.listClients = this.listClients.filter(
                (client) => client.id !== id
              );

              // Optionnel : Vous pouvez supprimer le client de la collection originale si vous le souhaitez
              this.http
                .delete<CLIENT>(`http://localhost:3000/clients/${id}`)
                .subscribe({
                  next: () => {
                    alert('CLIENT supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression du client dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement du client vers deletedClient",
                err
              );
            },
          });
      } else {
        alert("Le client n'a pas été trouvé.");
      }
    } else {
      alert("La suppression du client est annulé.");
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
