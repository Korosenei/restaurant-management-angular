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
import { USER } from '../../../../models/model-users/user.model';

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
    NgbModalModule,
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

  userMap: { [key: string]: USER } = {}; // Pour stocker les informations utilisateur par userId

  @ViewChild('qrcodeCanvas', { static: false }) qrCodeCanvas: any; // Utilisation de ViewChild pour récupérer le canvas

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getTickets();
  }

  ngAfterViewInit(): void {}

  // Générer un QR Code et l'afficher dans un canvas
  generateQRCode(ticket: TICKET, content: any): void {
    this.currentTicket = ticket; // Stocker le ticket courant
    const qrData = {
      transactionNumber: ticket.transactionDto?.reference,
      ticketNumber: ticket.numero,
      matricule: ticket.transactionDto?.userDto?.matricule,
      employeeName: `${ticket.transactionDto?.userDto?.nom} ${ticket.transactionDto?.userDto?.prenom}`,
      status: ticket.status,
      uniqueCode: this.generateUniqueCode(ticket),
    };

    this.qrCodeData = JSON.stringify(qrData);

    this.modalService.open(content);

    setTimeout(() => {
      this.generateQRCodeCanvas();
    }, 500); // Délai de 500 ms pour laisser le temps à la modale de se charger
  }

  // Générer un code unique pour chaque ticket
  generateUniqueCode(ticket: TICKET): string {
    return btoa(ticket.numero + ticket.transactionDto?.reference); // Base64 pour un code unique
  }

  // Générer et afficher le QR Code dans le canvas
  generateQRCodeCanvas(): void {
    if (this.qrCodeCanvas && this.qrCodeData) {
      QRCode.toCanvas(
        this.qrCodeCanvas.nativeElement,
        this.qrCodeData,
        (error) => {
          if (error) {
            console.error(error);
            return;
          }

          const qrCanvas = this.qrCodeCanvas.nativeElement;
          const qrCodeBase64 = qrCanvas.toDataURL('image/png');

          this.http
            .post('http://localhost:3000/qrCodes', { qrCodeData: qrCodeBase64 })
            .subscribe({
              next: (response) => {
                console.log('QR Code sauvegardé avec succès', response);
              },
              error: (err) => {
                console.error(
                  "Erreur lors de l'enregistrement du QR Code",
                  err
                );
              },
            });
        }
      );
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

  getTickets(): void {
    this.http.get<TICKET[]>('http://localhost:2027/tickets/all').subscribe({
      next: (res) => {
        this.listTickets = res;
        this.filteredTickets = [...res];
        this.totalItems = res.length;

        res.forEach((ticket) => {
          const userId = ticket.transactionDto?.userId;
          if (userId && !this.userMap[userId]) {
            this.getUserById(userId); // Charge l'utilisateur uniquement s'il n'est pas encore dans le cache
          }
        });

        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tickets', err);
      },
    });
  }

  getUserById(userId: number): void {
    this.http.get<USER>(`http://localhost:2028/users/${userId}`).subscribe({
      next: (user) => {
        this.userMap[userId] = user; // Sauvegarder l'utilisateur dans le map
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
      },
    });
  }

  getUserName(userId: number): string {
    const user = this.userMap[userId];
    return user ? `${user.prenom} ${user.nom}` : '---';
  }

  applyFilters() {
    let filtered = [...this.listTickets];

    if (this.searchTerm) {
      filtered = filtered.filter((ticket) =>
        ticket.numero.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrer par date (Assurez-vous que `creationDate` est bien formaté en `YYYY-MM-DD`)
    // Filtrage par plage de dates (creationDate et modifiedDate)
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((ticket) => {
        const createdDate = new Date(ticket.creationDate);
        const modifiedDate = new Date(ticket.modifiedDate);

        // Vérifier si la transaction a été créée ou modifiée dans la plage
        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (modifiedDate >= startDate && modifiedDate <= endDate)
        );
      });
    }

    // Mettre à jour la liste filtrée et la pagination
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
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.page = 1; // Revenir à la première page après filtrage
    this.applyFilters();
  }

  onDetail(_t29: TICKET) {
    throw new Error('Method not implemented.');
  }

  // Méthode pour choisir l'option d'exportation
  chooseExportOption(): 'all' | 'page' | 'cancel' {
    const choice = window.prompt(
      "Choisissez une option pour l'exportation :\n" +
        '1 - Exporter toute la liste\n' +
        '2 - Exporter seulement la page affichée\n' +
        '3 - Annuler',
      '1'
    );

    if (choice === '1') return 'all';
    if (choice === '2') return 'page';
    return 'cancel';
  }

  // Méthode pour formater la date en 'jj/MM/AAAA'
  formatDate(date?: string | Date): string {
    if (!date) return 'Non défini';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredTickets || this.filteredTickets.length === 0) {
      alert('Aucun ticket à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all' ? this.filteredTickets : this.displayedTickets;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
    const title = 'Liste des Tickets';
    const titleWidth = doc.getTextWidth(title); // Calculer la largeur du texte
    const pageWidth = doc.internal.pageSize.width; // Largeur de la page
    const xPosition = (pageWidth - titleWidth) / 2; // Calculer la position X pour centrer le titre

    doc.setFontSize(14);
    doc.text(title, xPosition, 15); // Centrer le titre

    // Préparation des données pour le tableau
    const headers = [
      [
        '#',
        'Date',
        'Transaction',
        'Numero',
        'Client',
        'Statut',
        'Montant',
        'Caissier',
      ],
    ];
    const data = dataToExport.map((ticket, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
      this.formatDate(ticket.transactionDto?.creationDate),
      ticket.transactionDto?.reference,
      ticket.numero,
      `${ticket.transactionDto?.userDto?.nom || ''} ${ticket.transactionDto?.userDto?.prenom || ''}`,
      ticket.status,
      ticket.transactionDto?.montant && ticket.transactionDto?.nbrTicket
  ? `${(ticket.transactionDto.montant / ticket.transactionDto.nbrTicket).toFixed(0)} FCFA`
  : 'Inconnu',
      'Non assigné',
      ticket.transactionDto?.userDto?.matricule || 'Non défini',
    ]);

    // Ajout du tableau
    (doc as any).autoTable({
      startY: 25,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      margin: { top: 20 },
    });

    // Gestion du pied de page
    const pageCount = doc.internal.pages.length - 1; // Récupérer le nombre total de pages
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);

      // Date d'export en bas à gauche
      doc.text(`Date d'export : ${currentDate}`, 10, pageHeight - 15);

      // Total des transactions exportées en bas à droite
      doc.text(
        `Total des tickets exportées : ${totalElements}`,
        230,
        pageHeight - 15
      );

      // Numérotation des pages au centre
      doc.text(`Page ${i} / ${pageCount}`, 150, pageHeight - 10, {
        align: 'center',
      });
    }

    const fileName =
      exportOption === 'all'
        ? `tickets_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `tickets_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
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
