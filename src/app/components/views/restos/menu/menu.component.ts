import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddMenuComponent } from '../../../pages/page-add/add-restos/add-menu/add-menu.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../pages/search/search.component';
import { MENU } from '../../../../models/model-restos/menu.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  menuObj: MENU = new MENU();

  listMenus: MENU[] = [];
  filteredMenus: MENU[] = [];
  displayedMenus: MENU[] = [];

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
    this.getMenus();
  }

  openModal() {
    this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getMenus() {
    this.http.get<MENU[]>('http://localhost:2026/menus/all').subscribe({
      next: (res) => {
        this.listMenus = res;
        this.filteredMenus = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des menus', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listMenus];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (menu) =>
          menu.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          menu.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((menu) => {
        const menuDate = new Date(menu.creationDate);
        return (
          menuDate >= new Date(this.selectedStartDate) &&
          menuDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredMenus = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedMenus = this.filteredMenus.slice(
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

  onEdite(data: MENU) {
    const modalRef = this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.menuObj = { ...data };
    modalRef.componentInstance.listMenus = this.listMenus;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getMenus();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce menu ?')) {
      this.http.delete(`http://localhost:2026/agences/delete/${id}`).subscribe({
        next: () => {
          alert('Menu supprimé avec succès !');
          this.getMenus();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression d menu', err);
          alert('Impossible de supprimer ce menu.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredMenus || this.filteredMenus.length === 0) {
      alert('Aucun menu à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les menus en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des menus', 10, 10);

      const headers = [['ID', 'Nom', 'Description', 'Image', 'Restaurant']];
      const data = this.filteredMenus.map((menu) => [
        menu.id,
        menu.nom,
        menu.description,
        menu.image,
        menu.restaurant?.nom,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('menus.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listMenus || this.listMenus.length === 0) {
      alert('Aucun menu à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les menus en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listMenus);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Menus');
      XLSX.writeFile(workbook, 'menus.xlsx');
    }
  }
}
