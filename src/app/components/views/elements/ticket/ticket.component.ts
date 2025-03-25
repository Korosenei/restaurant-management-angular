import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TICKET, Status } from '../../../../models/model-elements/ticket.model';
import { TRANSACTION } from '../../../../models/model-elements/transaction.model';



import { QRCodeModule } from 'angularx-qrcode';
import * as crypto from 'crypto-js';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
    QRCodeModule,
    NgbModalModule
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  ticketObj: TICKET = new TICKET();

  listTickets: TICKET[] = [];
  filteredTickets: TICKET[] = [];
  displayedTickets: TICKET[] = [];

  page = 1;
  pageSize = 5;
  totalItems = 0;

  searchTerm: string = '';
  selectedDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

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
      matricule: ticket.transactionDto?.userDto?.matricule,
      employeeName: `${ticket.transactionDto?.userDto?.nom} ${ticket.transactionDto?.userDto?.prenom}`,
      status: ticket.status,
      uniqueCode: this.generateUniqueCode(ticket)
    };

    this.qrCodeData = JSON.stringify(qrData);

    this.modalService.open(content);

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
    this.http.get<TICKET[]>('http://localhost:2027/tickets/all').subscribe({
      next: (res) => {
        this.listTickets = res;
        this.filteredTickets = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tickets', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listTickets];

    if (this.searchTerm) {
      filtered = filtered.filter((ticket) =>
        ticket.numero.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.creationDate);
        return (
          ticketDate >= new Date(this.selectedStartDate) &&
          ticketDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredTickets = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedTickets = this.filteredTickets.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.updateDisplayedRoles();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.page = 1;
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.applyFilters();
  }

  onDetail(_t29: TICKET) {
  throw new Error('Method not implemented.');
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredTickets || this.filteredTickets.length === 0) {
      alert('Aucun ticket à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les tickets en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des ticket', 10, 10);

      const headers = [['ID', 'Reference', 'Numero', 'Client']];
      const data = this.filteredTickets.map((ticket) => [
        ticket.id,
        ticket.transactionDto?.reference,
        ticket.numero,
        ticket.transactionDto?.userDto?.nom + ' ' + ticket.transactionDto?.userDto?.prenom,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('ticket.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listTickets || this.listTickets.length === 0) {
      alert('Aucun ticket à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les tickets en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listTickets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
      XLSX.writeFile(workbook, 'tickets.xlsx');
    }
  }
}
