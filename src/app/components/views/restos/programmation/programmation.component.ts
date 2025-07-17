import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddProgrammeComponent } from '../../../pages/page-add/add-restos/add-programme/add-programme.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PROGRAMME } from '../../../../models/model-restos/programme.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-programmation',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
  ],
  templateUrl: './programmation.component.html',
  styleUrl: './programmation.component.scss',
})
export class ProgrammationComponent implements OnInit {
  programmeObj: PROGRAMME = new PROGRAMME();

  listProgrammes: PROGRAMME[] = [];
  filteredProgrammes: PROGRAMME[] = [];
  displayedProgrammes: PROGRAMME[] = [];

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
    this.getProgrammes();
  }

  openModal() {
    this.modalService.open(AddProgrammeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getProgrammes() {
    this.http.get<PROGRAMME[]>('http://localhost:2025/passages/all').subscribe({
      next: (res) => {
        this.listProgrammes = res;
        this.filteredProgrammes = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des programmes', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listProgrammes];

    // Filtrer par texte
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (programme) =>
          programme.agence?.nom.toLowerCase().includes(searchLower) ||
          programme.agence?.sigle.toLowerCase().includes(searchLower) ||
          programme.agence?.ville.toLowerCase().includes(searchLower) ||
          programme.resto?.nom.toLowerCase().includes(searchLower) ||
          programme.resto?.ville.toLowerCase().includes(searchLower) ||
          programme.resto?.manager?.nom.toLowerCase().includes(searchLower) ||
          programme.resto?.manager?.prenom.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par date
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((programme) => {
        const startDate = new Date(programme.startDate);
        const endDate = new Date(programme.endDate);

        // Vérifier si la menu a été créée ou modifiée dans la plage
        return (
          (startDate >= startDate && startDate <= endDate) ||
          (endDate >= startDate && endDate <= endDate)
        );
      });
    }

    // Mettre à jour la liste filtrée et la pagination
    this.filteredProgrammes = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedProgrammes = this.filteredProgrammes.slice(
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
    this.page = 1;
    this.applyFilters();
  }

  onEdite(data: PROGRAMME) {
    const modalRef = this.modalService.open(AddProgrammeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.programmeObj = { ...data };
    modalRef.componentInstance.listProgrammes = this.listProgrammes;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getProgrammes();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce programme ?')) {
      this.http
        .delete(`http://localhost:2025/passages/delete/${id}`)
        .subscribe({
          next: () => {
            alert('Programme supprimé avec succès !');
            this.getProgrammes();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du programme', err);
            alert('Impossible de supprimer ce programme.');
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
  exportToPDF() {}

  // Exporter en Excel
  exportToExcel() {}
}
