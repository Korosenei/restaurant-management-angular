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
import { Civilite, Piece, RoleName, USER } from '../../../../models/model-users/user.model';
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
  pageSize = 1;
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
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.matricule.toLowerCase().includes(searchLower) ||
          user.piece.toLowerCase().includes(searchLower) ||
          user.numPiece.toLowerCase().includes(searchLower) ||
          user.nom.toLowerCase().includes(searchLower) ||
          user.prenom.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower) ||
          false
      );
    }

    // Filtrer par date (Assurez-vous que `creationDate` est bien formaté en `YYYY-MM-DD`)
    // Filtrage par plage de dates (creationDate et modifiedDate)
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((direction) => {
        const createdDate = new Date(direction.creationDate);
        const modifiedDate = new Date(direction.modifiedDate);

        // Vérifier si la direction a été créée ou modifiée dans la plage
        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (modifiedDate >= startDate && modifiedDate <= endDate)
        );
      });
    }

    // Mettre à jour la liste filtrée et la pagination
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
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.page = 1; // Revenir à la première page après filtrage
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

  // Exporter en PDF
  exportToPDF() {
    if (!this.filteredUsers || this.filteredUsers.length === 0) {
      alert('Aucun utilisateur à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all' ? this.filteredUsers : this.displayedUsers;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
    const title = 'Liste des Utilisateurs';
    const titleWidth = doc.getTextWidth(title); // Calculer la largeur du texte
    const pageWidth = doc.internal.pageSize.width; // Largeur de la page
    const xPosition = (pageWidth - titleWidth) / 2; // Calculer la position X pour centrer le titre

    doc.setFontSize(14);
    doc.text(title, xPosition, 15); // Centrer le titre

    // Préparation des données pour le tableau
    const headers = [
      [
        '#',
        'Matricule',
        'Nom',
        'Prénom',
        'Civilité',
        'Pièce',
        'Numéro de pièce',
        'Teléphone',
        'Email',
        'Direction',
        'Agence',
        'Role',
      ],
    ];
    const data = dataToExport.map((user, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
      user.matricule,
      user.nom,
      user.prenom,
      user.civilite,
      user.piece,
      user.numPiece,
      user.telephone,
      user.email,
      `${user.direction?.nom || 'Non assigné'}`,
      user.agenceId,
      user.role,
    ]);

    // Ajout du tableau
    (doc as any).autoTable({
      startY: 25,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      margin: { top: 20 },
    });

    // Gestion du pied de page
    const pageCount = doc.internal.pages.length - 1; // Récupérer le nombre total de pages
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);

      // Date d'export en bas à gauche
      doc.text(`Date d'export : ${currentDate}`, 10, pageHeight - 15);

      // Total des utilisateurs exportées en bas à droite
      doc.text(
        `Total des utilisateurs exportées : ${totalElements}`,
        230,
        pageHeight - 15
      );

      // Numérotation des pages au centre
      doc.text(`Page ${i} / ${pageCount}`, 150, pageHeight - 10, {
        align: 'center',
      });
    }

    const fileName =
      exportOption === 'all'
        ? `utilisateurs_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `utilisateurs_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.filteredUsers || this.filteredUsers.length === 0) {
      alert('Aucun utilisateurs à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all' ? this.filteredUsers : this.displayedUsers;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    // Préparation des données
    const formattedData = dataToExport.map((user, index) => ({
      '#':
        exportOption === 'all'
          ? index + 1
          : (this.page - 1) * this.pageSize + index + 1,
      Matricule: user.matricule,
      Nom: user.nom,
      Prénom: user.prenom,
      Civilité: user.civilite,
      Pièce: user.piece,
      'Numéro de pièce': user.numPiece,
      Téléphone: user.telephone,
      Email: user.email,
      Direction: `${user.direction?.nom || 'Non assigné'}`,
      Agence: user.agenceId,
      Role: user.role,
    }));

    // Ajout du total des utilisateurs exportées et de la date d'export en bas du fichier
    formattedData.push(
      {
        '#': 0,
        Matricule: '',
        Nom: '',
        Prénom: '',
        Civilité: Civilite.MME,
        Pièce: Piece.CNIB,
        'Numéro de pièce': '',
        Téléphone: 0,
        Email: '',
        Direction: '',
        Agence: 0,
        Role: RoleName.CLIENT,
      },
      {
        '#': 0,
        Matricule: '',
        Nom: 'Total utilisateur exportées :',
        Prénom: '',
        Civilité: Civilite.MME,
        Pièce: Piece.CNIB,
        'Numéro de pièce': totalElements.toString(),
        Téléphone: 0,
        Email: '',
        Direction: '',
        Agence: 0,
        Role: RoleName.CLIENT,
      },
      {
        '#': 0,
        Matricule: '',
        Nom: "Date d'export :",
        Prénom: '',
        Civilité: Civilite.MME,
        Pièce: Piece.CNIB,
        'Numéro de pièce': currentDate,
        Téléphone: 0,
        Email: '',
        Direction: '',
        Agence: 0,
        Role: RoleName.CLIENT,
      }
    );

    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');

    // Nom du fichier
    const fileName =
      exportOption === 'all'
        ? `utilisateurs_complete_${currentDate.replace(/[/,:]/g, '_')}.xlsx`
        : `utilisateurs_page_${currentDate.replace(/[/,:]/g, '_')}.xlsx`;

    // Enregistrement du fichier
    XLSX.writeFile(workbook, fileName);
  }
}
