import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddManagerComponent } from '../../../page-add/add-users/add-manager/add-manager.component';
import { DetailManagerComponent } from '../../../page-detail/detail-users/detail-manager/detail-manager.component';
import { MANAGER } from '../../../../../models/model-users/manager.model';

@Component({
  selector: 'app-list-manager',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-manager.component.html',
  styleUrl: './list-manager.component.scss',
})
export class ListManagerComponent implements OnInit {
  managerObj: MANAGER = new MANAGER();
  listManagers: MANAGER[] = [];
  selectedManager: MANAGER | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getManagers();
  }

  getManagers() {
    this.http.get<MANAGER[]>('http://localhost:3000/managers').subscribe({
      next: (res) => {
        this.listManagers = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des managers', err);
      },
    });
  }

  onDetail(manager: MANAGER) {
    const modalRef = this.modalService.open(DetailManagerComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.manager = manager;

    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

  onEdite(data: MANAGER) {
    const modalRef = this.modalService.open(AddManagerComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.managerObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          this.getManagers;
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const managerToDelete = this.listManagers.find(
      (manager) => manager.id === id
    );
    if (!managerToDelete) {
      alert("Le manager n'a pas été trouvé.");
      return;
    }
    const isDelete = confirm(
      `Êtes-vous sûr de vouloir supprimer le manager ${managerToDelete.nom} ${managerToDelete.prenom} ?`
    );

    if (isDelete) {
      if (managerToDelete) {
        this.http
          .post<MANAGER>('http://localhost:3000/deleteManager', managerToDelete)
          .subscribe({
            next: (res) => {
              this.listManagers = this.listManagers.filter(
                (manager) => manager.id !== id
              );

              this.http
                .delete<MANAGER>(`http://localhost:3000/managers/${id}`)
                .subscribe({
                  next: () => {
                    alert('MANAGER supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression de le manager dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement de le manager vers deletedBank',
                err
              );
            },
          });
      } else {
        alert("L'Employé n'a pas été trouvé.");
      }
    } else {
      alert("La suppression de l'employé est annulé.");
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
