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
import { AddManagerComponent } from '../../../pages/page-add/add-users/add-manager/add-manager.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent implements OnInit {
  managerObj: USER = new USER();

  listManagers: USER[] = [];
  filteredManagers: USER[] = [];
  displayedManagers: USER[] = [];

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
    this.getManagers();
  }

  openModal() {
    this.modalService.open(AddManagerComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getManagers() {
    this.http.get<USER[]>('http://localhost:2028/users/filter/role/MANAGER').subscribe({
      next: (res) => {
        this.listManagers = res;
        this.filteredManagers = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des managers', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listManagers];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (manager) =>
          manager.matricule
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          manager.piece.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          manager.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          manager.prenom
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          manager.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((manager) => {
        const managerDate = new Date(manager.creationDate);
        return (
          managerDate >= new Date(this.selectedStartDate) &&
          managerDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredManagers = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedManagers = this.filteredManagers.slice(
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
    modalRef.componentInstance.managerObj = { ...data };
    modalRef.componentInstance.listManagers = this.listManagers;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getManagers();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce manager ?')) {
      this.http.delete(`http://localhost:2028/users/delete/${id}`).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès !');
          this.getManagers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du manager', err);
          alert('Impossible de supprimer ce manager.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredManagers || this.filteredManagers.length === 0) {
      alert('Aucun manager à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les managers en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des managers', 10, 10);

      const headers = [['ID', 'Matricule', 'Client', 'Téléphone', 'Email']];
      const data = this.filteredManagers.map((manager) => [
        manager.id,
        manager.matricule,
        manager.nom && manager.prenom,
        manager.telephone,
        manager.email,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('manager.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listManagers || this.listManagers.length === 0) {
      alert('Aucun manager à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les managers en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listManagers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Managers');
      XLSX.writeFile(workbook, 'managers.xlsx');
    }
  }
}
