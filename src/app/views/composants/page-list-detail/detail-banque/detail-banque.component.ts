import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BANK } from '../../page-nouvel-element/new-banque/banque.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewBanqueComponent } from '../../page-nouvel-element/new-banque/new-banque.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-banque',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './detail-banque.component.html',
  styleUrl: './detail-banque.component.scss',
})
export class DetailBanqueComponent implements OnInit {
  // Objet BANQUE
  listBanks: BANK[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks() {
    this.http.get<BANK[]>('http://localhost:3000/banques').subscribe({
      next: (res) => {
        this.listBanks = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des banques", err);
      }
    });
  }

  onEdite(data: BANK) {
    const modalRef = this.modalService.open(NewBanqueComponent);
    modalRef.componentInstance.bankObj = { ...data }; // Passer les données au modal

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getBanks(); // Recharger la liste des banques depuis le serveur après la mise à jour
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm('Cette banque sera supprimée après confirmation !!! ');
    if (isDelete) {
      const bankToDelete = this.listBanks.find((bank) => bank.id === id);
      if (bankToDelete) {
        this.http.post<BANK>('http://localhost:3000/deleteBank', bankToDelete).subscribe({
          next: () => {
            this.listBanks = this.listBanks.filter((bank) => bank.id !== id);
            this.http.delete<BANK>(`http://localhost:3000/banques/${id}`).subscribe({
              next: () => {
                alert('BANQUE supprimée de la liste active avec succès');
              },
              error: (err) => {
                console.error('Erreur lors de la suppression de la banque dans la collection originale', err);
              },
            });
          },
          error: (err) => {
            console.error('Erreur lors du déplacement de la banque vers deletedBank', err);
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
