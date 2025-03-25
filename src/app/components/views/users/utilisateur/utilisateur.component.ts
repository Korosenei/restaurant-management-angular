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
  selector: 'app-utilisateur',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.scss',
})
export class UtilisateurComponent implements OnInit {
  userObj: USER = new USER();

  listUsers: USER[] = [];
  filteredUsers: USER[] = [];
  displayedUsers: USER[] = [];

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
    this.getUsers();
  }

  openModal() {
    this.modalService.open(AddUtilisateurComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getUsers() {
    this.http.get<USER[]>('http://localhost:2028/users/all').subscribe({
      next: (res) => {
        this.listUsers = res;
        this.filteredUsers = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listUsers];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.matricule
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          user.piece.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.creationDate);
        return (
          userDate >= new Date(this.selectedStartDate) &&
          userDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredUsers = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(
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
    modalRef.componentInstance.userObj = { ...data };
    modalRef.componentInstance.listUsers = this.listUsers;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getUsers();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.http.delete(`http://localhost:2028/users/delete/${id}`).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès !');
          this.getUsers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de utilisateur', err);
          alert('Impossible de supprimer cet utilisateur.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredUsers || this.filteredUsers.length === 0) {
      alert('Aucun utilisateur à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les utilisateurs en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des utilisateurs', 10, 10);

      const headers = [['ID', 'Matricule', 'Client', 'Téléphone', 'Email']];
      const data = this.filteredUsers.map((user) => [
        user.id,
        user.matricule,
        user.nom && user.prenom,
        user.telephone,
        user.email,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('utilisateur.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listUsers || this.listUsers.length === 0) {
      alert('Aucun utilisateurs à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les utilisateurs en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listUsers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
      XLSX.writeFile(workbook, 'utilisateurs.xlsx');
    }
  }
}
