import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgenceComponent } from '../../../page-add/add-structures/add-agence/add-agence.component';
import { AGENCE } from '../../../../../models/model-structures/agence.model';

@Component({
  selector: 'app-list-agence',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-agence.component.html',
  styleUrl: './list-agence.component.scss',
})
export class ListAgenceComponent implements OnInit {
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
        console.error('Erreur lors de la récupération des agences', err);
      },
    });
  }

  onEdite(data: AGENCE) {
    const modalRef = this.modalService.open(AddAgenceComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.agenceObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getAgences();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Cette agence sera supprimée après confirmation !!! '
    );
    if (isDelete) {
      const agenceToDelete = this.listAgences.find(
        (agence) => agence.id === id
      );
      if (agenceToDelete) {
        this.http
          .post<AGENCE>('http://localhost:3000/deleteAgence', agenceToDelete)
          .subscribe({
            next: () => {
              this.listAgences = this.listAgences.filter(
                (agence) => agence.id !== id
              );
              this.http
                .delete<AGENCE>(`http://localhost:3000/agences/${id}`)
                .subscribe({
                  next: () => {
                    alert('AGENCE supprimée de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression de l'agence dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement de l'agence vers deletedAgence",
                err
              );
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
