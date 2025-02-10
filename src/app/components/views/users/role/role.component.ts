import { Component, OnInit } from '@angular/core';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleComponent } from '../../../pages/page-add/add-users/add-role/add-role.component';
import { ROLE } from '../../../../models/model-users/role.model';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { SearchComponent } from '../../../pages/search/search.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  roleObj: ROLE = new ROLE();

  listRoles: ROLE[] = [];
  filteredRoles: ROLE[] = [];
  displayedRoles: ROLE[] = [];

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
    this.getRoles();
  }

  openModal() {
    this.modalService.open(AddRoleComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getRoles() {
    this.http.get<ROLE[]>('http://localhost:2028/roles/all').subscribe({
      next: (res) => {
        this.listRoles = res;
        this.filteredRoles = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rôles', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listRoles];

    if (this.searchTerm) {
      filtered = filtered.filter((role) =>
        role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((role) => {
        const roleDate = new Date(role.creationDate);
        return (
          roleDate >= new Date(this.selectedStartDate) &&
          roleDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredRoles = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedRoles = this.filteredRoles.slice(
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

  onEdite(data: ROLE) {
    const modalRef = this.modalService.open(AddRoleComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.roleObj = { ...data };
    modalRef.componentInstance.listRoles = this.listRoles;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getRoles();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.http.delete(`http://localhost:2028/roles/delete/${id}`).subscribe({
        next: () => {
          alert('Rôle supprimé avec succès !');
          this.getRoles();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du rôle', err);
          alert('Impossible de supprimer ce rôle.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredRoles || this.filteredRoles.length === 0) {
      alert("Aucun rôle à exporter.");
      return;
    }
  
    if (confirm("Voulez-vous vraiment exporter les rôles en PDF ?")) {
      const doc = new jsPDF();
      doc.text('Liste des rôles', 10, 10);
  
      const headers = [['ID', 'Nom du rôle', 'Libellé', 'Date de création']];
      const data = this.filteredRoles.map(role => [role.id, role.name, role.label, role.creationDate]);
  
      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });
  
      doc.save('roles.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listRoles || this.listRoles.length === 0) {
      alert("Aucun rôle à exporter.");
      return;
    }
  
    if (confirm("Voulez-vous vraiment exporter les rôles en Excel ?")) {
      const worksheet = XLSX.utils.json_to_sheet(this.listRoles);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
      XLSX.writeFile(workbook, 'roles.xlsx');
    }
  }
}
