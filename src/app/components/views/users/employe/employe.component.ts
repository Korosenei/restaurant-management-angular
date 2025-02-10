import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddEmployeComponent } from '../../../pages/page-add/add-users/add-employe/add-employe.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import { EMPLOYE } from '../../../../models/model-users/employe.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.scss',
})
export class EmployeComponent implements OnInit {
  employeObj: EMPLOYE = new EMPLOYE();

  listEmployes: EMPLOYE[] = [];
  filteredEmployes: EMPLOYE[] = [];
  displayedEmployes: EMPLOYE[] = [];

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
    this.getEmployes();
  }

  openModal() {
    this.modalService.open(AddEmployeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  
    getEmployes() {
      this.http.get<EMPLOYE[]>('http://localhost:2028/users/all').subscribe({
        next: (res) => {
          this.listEmployes = res;
          this.filteredEmployes = [...res];
          this.totalItems = res.length;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des employés', err);
        },
      });
    }
  
    applyFilters() {
      let filtered = [...this.listEmployes];
  
      if (this.searchTerm) {
        filtered = filtered.filter((employe) =>
          employe.matricule.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employe.piece.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employe.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employe.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
  
      if (this.selectedStartDate && this.selectedEndDate) {
        filtered = filtered.filter((employe) => {
          const employeDate = new Date(employe.creationDate);
          return (
            employeDate >= new Date(this.selectedStartDate) &&
            employeDate <= new Date(this.selectedEndDate)
          );
        });
      }
  
      this.filteredEmployes = filtered;
      this.totalItems = filtered.length;
      this.updateDisplayedRoles();
    }
  
    updateDisplayedRoles() {
      const startIndex = (this.page - 1) * this.pageSize;
      this.displayedEmployes = this.filteredEmployes.slice(
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
    
      onEdite(data: EMPLOYE) {
        const modalRef = this.modalService.open(AddEmployeComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
        modalRef.componentInstance.employeObj = { ...data };
        modalRef.componentInstance.listEmployes = this.listEmployes;
    
        modalRef.result.then(
          (result) => {
            if (result === 'updated') {
              this.getEmployes();
            }
          },
          (reason) => {
            console.log('Modal dismissed: ' + reason);
          }
        );
      }
    
      onDelete(id: number) {
        if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
          this.http.delete(`http://localhost:2028/users/delete/${id}`).subscribe({
            next: () => {
              alert('Employé supprimé avec succès !');
              this.getEmployes();
            },
            error: (err) => {
              console.error('Erreur lors de la suppression de employé', err);
              alert('Impossible de supprimer cet employé.');
            },
          });
        }
      }
    
      // Méthode pour l'export PDF
      exportToPDF() {
        if (!this.filteredEmployes || this.filteredEmployes.length === 0) {
          alert("Aucun employé à exporter.");
          return;
        }
      
        if (confirm("Voulez-vous vraiment exporter les employés en PDF ?")) {
          const doc = new jsPDF();
          doc.text('Liste des employés', 10, 10);
      
          const headers = [['ID', 'Matricule', 'Client', 'Téléphone', 'Email']];
          const data = this.filteredEmployes.map(
            employe => [employe.id, employe.matricule, employe.nom && employe.prenom, employe.telephone, employe.email]
          );
      
          (doc as any).autoTable({
            startY: 20,
            head: headers,
            body: data,
            theme: 'grid',
          });
      
          doc.save('employes.pdf');
        }
      }
    
      // Exporter en Excel
      exportToExcel() {
        if (!this.listEmployes || this.listEmployes.length === 0) {
          alert("Aucun employé à exporter.");
          return;
        }
      
        if (confirm("Voulez-vous vraiment exporter les employés en Excel ?")) {
          const worksheet = XLSX.utils.json_to_sheet(this.listEmployes);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Employes');
          XLSX.writeFile(workbook, 'employes.xlsx');
        }
      }
}
