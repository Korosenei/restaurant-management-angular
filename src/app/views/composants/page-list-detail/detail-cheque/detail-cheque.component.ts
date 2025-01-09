import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CHEQUE } from '../../page-nouvel-element/new-cheque/cheque.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewChequeComponent } from '../../page-nouvel-element/new-cheque/new-cheque.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-cheque',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-cheque.component.html',
  styleUrl: './detail-cheque.component.scss',
})
export class DetailChequeComponent implements OnInit {
  // Objet CHEQUE
  chequeObj: CHEQUE = new CHEQUE();
  listCheques: CHEQUE[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCheques();
  }

  getCheques() {
    this.http.get<CHEQUE[]>('http://localhost:3000/cheques').subscribe({
      next: (res) => {
        this.listCheques = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des chèques', err);
      },
    });
  }

  onEdite(data: CHEQUE) {
    const modalRef = this.modalService.open(NewChequeComponent, {size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap'
    });

    modalRef.componentInstance.chequeObj = { ...data }; // Passe les données du chèque au modal

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          this.getCheques(); // Recharger la liste des chèques depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm('Ce chèque sera supprimé après confirmation !!!');
    if (isDelete) {
      const chequeToDelete = this.listCheques.find(
        (cheque) => cheque.id === id
      );

      if (chequeToDelete) {
        this.http
          .post<CHEQUE>('http://localhost:3000/deleteCheque', chequeToDelete)
          .subscribe({
            next: () => {
              this.listCheques = this.listCheques.filter(
                (cheque) => cheque.id !== id
              );
              this.http
                .delete(`http://localhost:3000/cheques/${id}`)
                .subscribe({
                  next: () => {
                    alert('Chèque supprimé avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression du chèque dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement du chèque vers deleteCheque',
                err
              );
            },
          });
      } else {
        alert("Le chèque n'a pas été trouvé.");
      }
    } else {
      alert('La suppression du chèque est annulée.');
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
