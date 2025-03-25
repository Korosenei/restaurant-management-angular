import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddDirectionComponent } from '../../../pages/page-add/add-structures/add-direction/add-direction.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import { DIRECTION } from '../../../../models/model-structures/direction.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './direction.component.html',
  styleUrl: './direction.component.scss',
})
export class DirectionComponent implements OnInit {
  directionObj: DIRECTION = new DIRECTION();
  listDirections: DIRECTION[] = [];
  filteredDirections: DIRECTION[] = [];
  displayedDirections: DIRECTION[] = [];

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
    this.getDirections();
  }

  openModal() {
    this.modalService.open(AddDirectionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getDirections() {
    this.http
      .get<DIRECTION[]>('http://localhost:2025/directions/all')
      .subscribe({
        next: (res) => {
          this.listDirections = res;
          this.filteredDirections = [...res];
          this.totalItems = res.length;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des directions', err);
        },
      });
  }

  applyFilters() {
    let filtered = [...this.listDirections];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (direction) =>
          direction.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          direction.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((direction) => {
        const directionDate = new Date(direction.creationDate);
        return (
          directionDate >= new Date(this.selectedStartDate) &&
          directionDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredDirections = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedDirections = this.filteredDirections.slice(
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

  onEdite(data: DIRECTION) {
    const modalRef = this.modalService.open(AddDirectionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.directionObj = { ...data };
    modalRef.componentInstance.listDirections = this.listDirections;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getDirections();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette direction ?')) {
      this.http
        .delete(`http://localhost:2025/directions/delete/${id}`)
        .subscribe({
          next: () => {
            alert('Direction supprimée avec succès !');
            this.getDirections();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la direction', err);
            alert('Impossible de supprimer cette direction.');
          },
        });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredDirections || this.filteredDirections.length === 0) {
      alert('Aucune direction à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les directions en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des directions', 10, 10);

      const headers = [['ID', 'Sigle', 'Region', 'Ville', 'Responsable']];
      const data = this.filteredDirections.map((direction) => [
        direction.id,
        direction.sigle,
        direction.region,
        direction.ville,
        direction.userId,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('directions.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listDirections || this.listDirections.length === 0) {
      alert('Aucune direction à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les directions en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listDirections);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Directions');
      XLSX.writeFile(workbook, 'directions.xlsx');
    }
  }
}
