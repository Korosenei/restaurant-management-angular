import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddTransactionComponent } from '../../../pages/page-add/add-elements/add-transaction/add-transaction.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TRANSACTION } from '../../../../models/model-elements/transaction.model';

import { AuthService } from '../../../../services/auth-service/auth.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  transactionObj: TRANSACTION = new TRANSACTION();

  listTransactions: TRANSACTION[] = [];
  filteredTransactions: TRANSACTION[] = [];
  displayedTransactions: TRANSACTION[] = [];

  page = 1;
  pageSize = 10;
  totalItems = 0;

  searchTerm: string = '';
  selectedDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  userRole: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.getTransactions();
  }

  openModal() {
    this.modalService.open(AddTransactionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getTransactions() {
    this.http
      .get<TRANSACTION[]>('http://localhost:2027/transactions/all')
      .subscribe({
        next: (transactions: TRANSACTION[]) => {
          const currentUserId = Number(localStorage.getItem('userId'));

          // Filtrage selon le rôle utilisateur
          if (this.userRole === 'CLIENT') {
            this.listTransactions = transactions.filter(
              (item) => item.clientId === currentUserId
            );
          } else {
            this.listTransactions = transactions;
          }

          this.filteredTransactions = [...this.listTransactions];
          this.totalItems = this.filteredTransactions.length;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des transactions', err);
        },
      });
  }

  applyFilters() {
    let filtered = [...this.listTransactions];

    // 🔍 Filtre par recherche
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          (typeof transaction.reference === 'string' &&
            transaction.reference.toLowerCase().includes(searchLower)) ||
          (typeof transaction.nom === 'string' &&
            transaction.nom.toLowerCase().includes(searchLower)) ||
          (typeof transaction.prenom === 'string' &&
            transaction.prenom.toLowerCase().includes(searchLower)) ||
          transaction.nbrTicket.toString().includes(searchLower)
      );
    }

    // 📅 Filtrage par plage de dates
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((transaction) => {
        const createdDate = new Date(transaction.creationDate);
        const modifiedDate = new Date(transaction.modifiedDate);

        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (modifiedDate >= startDate && modifiedDate <= endDate)
        );
      });
    }

    // ✅ Mise à jour des résultats
    this.filteredTransactions = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedTransactions = this.filteredTransactions.slice(
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

  onEdite(data: TRANSACTION) {
    const modalRef = this.modalService.open(AddTransactionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.transactionObj = { ...data };
    modalRef.componentInstance.listTransactions = this.listTransactions;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getTransactions();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette transaction ?')) {
      this.http
        .delete(`http://localhost:2027/transactions/delete/${id}`)
        .subscribe({
          next: () => {
            alert('Transaction supprimée avec succès !');
            this.getTransactions();
          },
          error: (err) => {
            console.error(
              'Erreur lors de la suppression de la transaction',
              err
            );
            alert('Impossible de supprimer cette transaction.');
          },
        });
    }
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
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Les mois commencent à 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredTransactions || this.filteredTransactions.length === 0) {
      alert('Aucune transaction à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all'
        ? this.filteredTransactions
        : this.displayedTransactions;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
    const title = 'Liste des Transactions';
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
        'Reference',
        'Client',
        'Nbrs Tickets',
        'Premier Ticket',
        'Dernier Ticket',
        'Montant',
        'Caissier',
      ],
    ];
    const data = dataToExport.map((transaction, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
      this.formatDate(transaction.modifiedDate),
      transaction.reference,
      `${transaction.client?.nom || ''} ${transaction.client?.prenom || ''}`,
      transaction.nbrTicket,
      transaction.firstTicketNum || 'Non défini',
      transaction.lastTicketNum || 'Non défini',
      `${transaction.montant} FCFA`,
      'Non assigné',
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
        `Total des transactions exportées : ${totalElements}`,
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
        ? `transactions_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `transactions_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listTransactions || this.listTransactions.length === 0) {
      alert('Aucune transaction à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les transactions en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listTransactions);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
      XLSX.writeFile(workbook, 'transactions.xlsx');
    }
  }
}
