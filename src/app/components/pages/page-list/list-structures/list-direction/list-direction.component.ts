import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDirectionComponent } from '../../../page-add/add-structures/add-direction/add-direction.component';
import { DIRECTION } from '../../../../../models/model-structures/direction.model';

@Component({
  selector: 'app-list-direction',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-direction.component.html',
  styleUrl: './list-direction.component.scss',
})
export class ListDirectionComponent implements OnInit {
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
    this.http.get<DIRECTION[]>('http://localhost:2025/directions/all').subscribe({
      next: (res) => {
        this.listDirections = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des directions', err);
      },
    });
  }

  onEdite(data: DIRECTION) {
    const modalRef = this.modalService.open(AddDirectionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.directionObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          this.getDirections();
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
      const directionToDelete = this.listDirections.find(
        (direction) => direction.id === id
      );

      if (directionToDelete) {
        this.http
          .post<DIRECTION>(
            'http://localhost:3000/deleteDirection',
            directionToDelete
          )
          .subscribe({
            next: (res) => {
              this.listDirections = this.listDirections.filter(
                (direction) => direction.id !== id
              );

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
}
