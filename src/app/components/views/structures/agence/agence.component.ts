import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddAgenceComponent } from '../../../pages/page-add/add-structures/add-agence/add-agence.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../pages/search/search.component';
import { AGENCE } from '../../../../models/model-structures/agence.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-agence',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss',
})
export class AgenceComponent implements OnInit {
  agenceObj: AGENCE = new AGENCE();

  listAgences: AGENCE[] = [];
  filteredAgences: AGENCE[] = [];
  displayedAgences: AGENCE[] = [];

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
    this.getAgences();
  }

  openModal() {
    this.modalService.open(AddAgenceComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getAgences() {
    this.http.get<AGENCE[]>('http://localhost:2025/agences/all').subscribe({
      next: (res) => {
        this.listAgences = res;
        this.filteredAgences = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des agences', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listAgences];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (agence) =>
          agence.sigle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          agence.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          agence.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((agence) => {
        const agenceDate = new Date(agence.creationDate);
        return (
          agenceDate >= new Date(this.selectedStartDate) &&
          agenceDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredAgences = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedAgences = this.filteredAgences.slice(
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
  
    onEdite(data: AGENCE) {
      const modalRef = this.modalService.open(AddAgenceComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.agenceObj = { ...data };
      modalRef.componentInstance.listAgences = this.listAgences;
  
      modalRef.result.then(
        (result) => {
          if (result === 'updated') {
            this.getAgences();
          }
        },
        (reason) => {
          console.log('Modal dismissed: ' + reason);
        }
      );
    }
  
    onDelete(id: number) {
      if (confirm('Voulez-vous vraiment supprimer cette agence ?')) {
        this.http.delete(`http://localhost:2025/agences/delete/${id}`).subscribe({
          next: () => {
            alert('Agence supprimée avec succès !');
            this.getAgences();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de agence', err);
            alert('Impossible de supprimer cette agence.');
          },
        });
      }
    }
  
    // Méthode pour l'export PDF
    exportToPDF() {
      if (!this.filteredAgences || this.filteredAgences.length === 0) {
        alert("Aucune agence à exporter.");
        return;
      }
    
      if (confirm("Voulez-vous vraiment exporter les agences en PDF ?")) {
        const doc = new jsPDF();
        doc.text('Liste des agences', 10, 10);
    
        const headers = [['ID', 'Code', 'Sigle', 'Ville', 'Responsable']];
        const data = this.filteredAgences.map(
          agence => [agence.id, agence.code, agence.sigle, agence.ville, agence.userId]
        );
    
        (doc as any).autoTable({
          startY: 20,
          head: headers,
          body: data,
          theme: 'grid',
        });
    
        doc.save('agences.pdf');
      }
    }
  
    // Exporter en Excel
    exportToExcel() {
      if (!this.listAgences || this.listAgences.length === 0) {
        alert("Aucune agence à exporter.");
        return;
      }
    
      if (confirm("Voulez-vous vraiment exporter les agences en Excel ?")) {
        const worksheet = XLSX.utils.json_to_sheet(this.listAgences);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Agences');
        XLSX.writeFile(workbook, 'agences.xlsx');
      }
    }
}
