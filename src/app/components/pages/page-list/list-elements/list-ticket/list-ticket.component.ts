import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddTicketComponent } from '../../../page-add/add-elements/add-ticket/add-ticket.component';
import { DetailTicketComponent } from '../../../page-detail/detail-elements/detail-ticket/detail-ticket.component';
import { TICKET } from '../../../../../models/model-elements/ticket.model';

import { QRCodeModule } from 'angularx-qrcode';
import * as crypto from 'crypto-js';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-list-ticket',
  standalone: true,
  imports: [CommonModule, HttpClientModule, QRCodeModule, NgbModalModule],
  templateUrl: './list-ticket.component.html',
  styleUrl: './list-ticket.component.scss',
})
export class ListTicketComponent implements OnInit, AfterViewInit{
  ticketObj: TICKET = new TICKET();
  listTickets: TICKET[] = [];

  qrCodeData: string | null = null;
  currentTicket: TICKET | null = null; // Ajouter une propriété pour le ticket actuel

  @ViewChild('qrcodeCanvas', { static: false }) qrCodeCanvas: any;  // Utilisation de ViewChild pour récupérer le canvas

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getTickets();
  }

  ngAfterViewInit(): void {
    
  }

  // Générer un QR Code et l'afficher dans un canvas
  generateQRCode(ticket: TICKET, content: any): void {
    this.currentTicket = ticket; // Stocker le ticket courant
    const qrData = {
      transactionNumber: ticket.transactionDto?.reference,
      ticketNumber: ticket.numero,
      matricule: ticket.transactionDto?.employeDto?.matricule,
      employeeName: `${ticket.transactionDto?.nom} ${ticket.transactionDto?.prenom}`,
      status: ticket.status,
      uniqueCode: this.generateUniqueCode(ticket)
    };

    this.qrCodeData = JSON.stringify(qrData);

    this.modalService.open(content); // Ouvre la modale et attend qu'elle soit complètement chargée

    // Une fois la modale ouverte, nous générons le QR Code dans le canvas avec un léger délai
    setTimeout(() => {
      this.generateQRCodeCanvas();
    }, 500); // Délai de 500 ms pour laisser le temps à la modale de se charger
  }

  // Générer un code unique pour chaque ticket
  generateUniqueCode(ticket: TICKET): string {
    return btoa(ticket.numero + ticket.transactionDto?.reference);  // Base64 pour un code unique
  }

  // Générer et afficher le QR Code dans le canvas
  generateQRCodeCanvas(): void {
    if (this.qrCodeCanvas && this.qrCodeData) {
      QRCode.toCanvas(this.qrCodeCanvas.nativeElement, this.qrCodeData, (error) => {
        if (error) {
          console.error(error);
          return;
        }

        const qrCanvas = this.qrCodeCanvas.nativeElement;
        const qrCodeBase64 = qrCanvas.toDataURL('image/png');

        this.http.post('http://localhost:3000/qrCodes', { qrCodeData: qrCodeBase64 })
          .subscribe({
            next: (response) => {
              console.log('QR Code sauvegardé avec succès', response);
            },
            error: (err) => {
              console.error('Erreur lors de l\'enregistrement du QR Code', err);
            }
          });
      });
    }
  }

  downloadQRCode(): void {
    const qrCanvas = this.qrCodeCanvas.nativeElement;

    if (qrCanvas) {
      const dataUrl = qrCanvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `QRCode_${this.currentTicket?.numero}.png`;
      link.click();
    } else {
      console.error('Canvas non trouvé');
    }
  }


  getTickets() {
    this.http.get<TICKET[]>('http://localhost:3000/tickets').subscribe({
      next: (res) => {
        this.listTickets = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tickets', err);
      },
    });
  }

    onDetail(ticket: TICKET) {
      const modalRef = this.modalService.open(DetailTicketComponent, {
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.ticket = ticket;

      modalRef.result.then(
        (result) => {
          console.log('Modal fermé avec:', result);
        },
        (reason) => {
          console.log('Modal dismissed:', reason);
        }
      );
    }

  onEdite(data: TICKET) {
    const modalRef = this.modalService.open(AddTicketComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.menuObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getTickets();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm('Ce ticket sera supprimé après confirmation !!! ');
    if (isDelete) {
      const ticketToDelete = this.listTickets.find(
        (ticket) => ticket.id === id
      );

      if (ticketToDelete) {
        this.http
          .post<TICKET>('http://localhost:3000/deleteTicket', ticketToDelete)
          .subscribe({
            next: (res) => {
              this.listTickets = this.listTickets.filter(
                (ticket) => ticket.id !== id
              );

              this.http
                .delete<TICKET>(`http://localhost:3000/tickets/${id}`)
                .subscribe({
                  next: () => {
                    alert('TICKET supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      'Erreur lors de la suppression du ticket dans la collection originale',
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                'Erreur lors du déplacement du ticket vers deletedTicket',
                err
              );
            },
          });
      } else {
        alert("Le ticket n'a pas été trouvée.");
      }
    } else {
      alert('La suppression du ticket est annulée.');
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
