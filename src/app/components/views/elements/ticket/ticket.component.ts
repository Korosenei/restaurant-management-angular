import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TICKET, Status } from '../../../../models/model-elements/ticket.model';
import { USER } from '../../../../models/model-users/user.model';

import { QRCodeModule } from 'angularx-qrcode';
import * as crypto from 'crypto-js';
import * as QRCode from 'qrcode';
import { QRCODE } from '../../../../models/model-restos/qrcode.model';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../services/auth-service/auth.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
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
  // Properties
  @ViewChild('clientIdModal') clientIdModal: any;
  @ViewChild('qrCodeModal') qrCodeModal: any;
  @ViewChild('qrcodeCanvas') qrCodeCanvas: any;

  generatedQrCode: QRCODE | null = null;
  qrCodeData: string | null = null;
  clientIdForQrCode: number | null = null;
  showClientIdForm: boolean = false;
  modalTitle: string = '';
  userRole: string = '';
  userMap: { [key: string]: USER } = {};

  ticketObj: TICKET = new TICKET();
  listTickets: TICKET[] = [];
  filteredTickets: TICKET[] = [];
  displayedTickets: TICKET[] = [];

  page = 1;
  pageSize = 5;
  totalItems = 0;

  selectedStatus: string = 'ALL';
  sortOrder: string = 'recent';
  searchTerm: string = '';
  selectedDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.getTickets();
  }

  ngAfterViewInit(): void {}

  // QR Code Generation Flow
  initiateQrCodeGeneration(): void {
    if (this.userRole === 'CLIENT') {
      this.generateClientQrCode();
    } else {
      this.openClientIdModal();
    }
  }

  private generateClientQrCode(): void {
    const clientId = this.authService.getCurrentUserId();
    if (clientId) {
      this.fetchQrCode(clientId, this.qrCodeModal);
    }
  }

  private openClientIdModal(): void {
    this.modalTitle = "Saisir l'ID client";
    this.clientIdForQrCode = null;
    const modalRef = this.modalService.open(this.clientIdModal);

    modalRef.result.then(
      () => this.onClientIdConfirmed(),
      () => this.onModalDismissed()
    );
  }

  onClientIdConfirmed(): void {
    if (this.clientIdForQrCode) {
      this.fetchQrCode(this.clientIdForQrCode, this.qrCodeModal);
    }
  }

  onModalDismissed(): void {
    console.log('Modal dismissed');
  }

  private fetchQrCode(clientId: number, modalTemplate: any): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .get<QRCODE>(`http://localhost:2030/qrcodes/generate/${clientId}`, {
        headers,
      })
      .subscribe({
        next: (response) => this.handleQrCodeSuccess(response, modalTemplate),
        error: (err) => this.handleQrCodeError(err),
      });
  }

  private handleQrCodeSuccess(response: QRCODE, modalTemplate: any): void {
    this.generatedQrCode = response;
    this.qrCodeData = response.qrCodeData;
    this.modalTitle = `QR Code - ${response.client?.prenom} ${response.client?.nom}`;

    const modalRef = this.modalService.open(modalTemplate);

    setTimeout(() => {
      this.renderQrCodeCanvas();
    }, 100);
  }

  private handleQrCodeError(error: any): void {
    console.error('QR Code Error:', error);
    let errorMessage = 'Erreur lors de la génération du QR Code';

    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur';
    } else if (error.status === 404) {
      errorMessage = 'Client non trouvé';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides';
    }

    alert(errorMessage);
  }

  private renderQrCodeCanvas(): void {
    if (this.qrCodeCanvas && this.qrCodeData) {
      QRCode.toCanvas(
        this.qrCodeCanvas.nativeElement,
        this.qrCodeData,
        { width: 200 },
        (err) => {
          if (err) console.error('QR Canvas Error:', err);
        }
      );
    }
  }

  downloadQrCode(): void {
    if (!this.qrCodeCanvas?.nativeElement) return;

    const canvas = this.qrCodeCanvas.nativeElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `QRCode_${
      this.generatedQrCode?.ticket?.numero || Date.now()
    }.png`;
    link.click();
  }

  getTickets(): void {
    this.http.get<TICKET[]>('http://localhost:2027/tickets/all').subscribe({
      next: (tickets: TICKET[]) => {
        const currentUserId = localStorage.getItem('userId');

        // Filtrage selon le rôle utilisateur
        if (this.userRole === 'CLIENT') {
          this.listTickets = tickets.filter(
            (ticket) => ticket.client?.id?.toString() === currentUserId
          );
        } else {
          this.listTickets = tickets;
        }

        this.filteredTickets = [...this.listTickets];
        this.totalItems = this.filteredTickets.length;

        // 📥 Chargement des utilisateurs impliqués
        this.preloadUsersFromTickets(this.listTickets);

        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tickets', err);
      },
    });
  }

  preloadUsersFromTickets(tickets: TICKET[]): void {
    const userIds = new Set<number>();

    tickets.forEach((ticket) => {
      const userId = ticket.transactionDto?.userId;
      if (userId && !this.userMap[userId]) {
        userIds.add(userId);
      }
    });

    userIds.forEach((userId) => this.getUserById(userId));
  }

  getUserById(userId: number): void {
    this.http.get<USER>(`http://localhost:2028/users/${userId}`).subscribe({
      next: (user) => {
        this.userMap[userId] = user;
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

    // 🔍 Filtre par recherche
    if (this.searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          ticket.transactionDto?.reference
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          ticket.client?.nom
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          ticket.client?.prenom
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    // 📅 Filtre par plage de dates
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((ticket) => {
        const createdDate = new Date(ticket.creationDate);
        const modifiedDate = new Date(ticket.modifiedDate);
        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (modifiedDate >= startDate && modifiedDate <= endDate)
        );
      });
    }

    // ✅ Filtre par statut
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(
        (ticket) => ticket.status === this.selectedStatus
      );
    }

    // ⬆️⬇️ Tri par date de création (ou modification si tu préfères)
    filtered.sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();

      return this.sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    // 📄 Mise à jour des tickets affichés
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
        'Acheté le',
        'Transaction',
        'Numero',
        'Client',
        'Statut',
        'Consommé le',
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
      `${ticket.client?.nom || ''} ${ticket.client?.prenom || ''}`,
      ticket.status,
      ticket.status === 'CONSOMME'
        ? this.formatDate(ticket.modifiedDate)
        : 'Non cosommé',
      ticket.transactionDto?.montant && ticket.transactionDto?.nbrTicket
        ? `${(
            ticket.transactionDto.montant / ticket.transactionDto.nbrTicket
          ).toFixed(0)} FCFA`
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
