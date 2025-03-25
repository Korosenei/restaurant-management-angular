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
  pageSize = 5;
  totalItems = 0;

  searchTerm: string = '';
  selectedDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
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
        next: (res) => {
          this.listTransactions = res;
          this.filteredTransactions = [...res];
          this.totalItems = res.length;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des transactions', err);
        },
      });
  }

  applyFilters() {
    let filtered = [...this.listTransactions];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.reference
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.creationDate);
        return (
          transactionDate >= new Date(this.selectedStartDate) &&
          transactionDate <= new Date(this.selectedEndDate)
        );
      });
    }

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
    this.page = 1;
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
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

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredTransactions || this.filteredTransactions.length === 0) {
      alert('Aucune transaction à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les transactions en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des transactions', 10, 10);

      const headers = [
        ['ID', 'Client', 'Nombre', 'Premier Num', 'Dernier Num', 'montant'],
      ];
      const data = this.filteredTransactions.map((transaction) => [
        transaction.id,
        transaction.userDto?.nom && transaction.userDto.prenom,
        transaction.nbrTicket,
        transaction.firstNumTicket,
        transaction.lastNumTicket,
        transaction.montant,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('transactions.pdf');
    }
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
