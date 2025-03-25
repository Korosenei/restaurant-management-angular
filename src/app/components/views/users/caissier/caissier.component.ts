import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddUtilisateurComponent } from '../../../pages/page-add/add-users/add-utilisateur/add-utilisateur.component';
import { UserDetailComponent } from '../../../pages/buttons/user-detail/user-detail.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../../pages/search/search.component';
import { USER } from '../../../../models/model-users/user.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-caissier',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './caissier.component.html',
  styleUrl: './caissier.component.scss',
})
export class CaissierComponent implements OnInit {
  caissierObj: USER = new USER();

  listCaissiers: USER[] = [];
  filteredCaissiers: USER[] = [];
  displayedCaissiers: USER[] = [];

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
    this.getCaissiers();
  }

  getCaissiers() {
    this.http.get<USER[]>('http://localhost:2028/users/filter/role/CAISSIER').subscribe({
      next: (res) => {
        this.listCaissiers = res;
        this.filteredCaissiers = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des caissiers', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listCaissiers];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (caissier) =>
          caissier.matricule
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          caissier.piece
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          caissier.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          caissier.prenom
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          caissier.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((caissier) => {
        const caissierDate = new Date(caissier.creationDate);
        return (
          caissierDate >= new Date(this.selectedStartDate) &&
          caissierDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredCaissiers = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedCaissiers = this.filteredCaissiers.slice(
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

  onDetail(user: USER) {
    const modalRef = this.modalService.open(UserDetailComponent, {
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false, // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.user = user;

    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

  onEdite(data: USER) {
    const modalRef = this.modalService.open(AddUtilisateurComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.caissierObj = { ...data };
    modalRef.componentInstance.listCaissiers = this.listCaissiers;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getCaissiers();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce caissier ?')) {
      this.http.delete(`http://localhost:2028/users/delete/${id}`).subscribe({
        next: () => {
          alert('Caissier supprimé avec succès !');
          this.getCaissiers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du caissier', err);
          alert('Impossible de supprimer ce caissier.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredCaissiers || this.filteredCaissiers.length === 0) {
      alert('Aucun caissier à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les caissiers en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des caissiers', 10, 10);

      const headers = [['ID', 'Matricule', 'Client', 'Téléphone', 'Email']];
      const data = this.filteredCaissiers.map((caissier) => [
        caissier.id,
        caissier.matricule,
        caissier.nom && caissier.prenom,
        caissier.telephone,
        caissier.email,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('caissiers.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listCaissiers || this.listCaissiers.length === 0) {
      alert('Aucun employé à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les caissiers en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listCaissiers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'caissiers');
      XLSX.writeFile(workbook, 'caissiers.xlsx');
    }
  }
}
