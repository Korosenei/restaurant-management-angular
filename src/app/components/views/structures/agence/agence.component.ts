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

    // Filtrer par texte (nom, sigle, direction, ville, responsable)
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agence) =>
          agence.nom.toLowerCase().includes(searchLower) ||
          agence.sigle.toLowerCase().includes(searchLower) ||
          agence.directionDto?.sigle.toLowerCase().includes(searchLower) ||
          agence.ville.toLowerCase().includes(searchLower) ||
          agence.responsable?.nom.toLowerCase().includes(searchLower) ||
          false ||
          agence.responsable?.prenom.toLowerCase().includes(searchLower) ||
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
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.page = 1; // Revenir à la première page après filtrage
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
    if (!this.filteredAgences || this.filteredAgences.length === 0) {
      alert('Aucune agence à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all'
        ? this.filteredAgences
        : this.displayedAgences;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
    doc.setFontSize(14);
    doc.text('Liste des Agences', 105, 15, { align: 'center' });

    // Préparation des données pour le tableau
    const headers = [['#', 'Nom', 'Sigle', 'Direction', 'Ville', 'Responsable']];
    const data = dataToExport.map((agence, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
        agence.nom,
      agence.sigle,
      agence.directionDto?.sigle || '',
      agence.ville,
      `${agence.responsable?.nom || ''} ${agence.responsable?.prenom || ''}`,
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
      doc.text(`Date d'export: ${currentDate}`, 10, pageHeight - 15);

      // Total des agences exportées en bas à droite
      doc.text(
        `Total des agences exportées: ${totalElements}`,
        140,
        pageHeight - 15
      );

      // Numérotation des pages au centre
      doc.text(`Page ${i} / ${pageCount}`, 105, pageHeight - 10, {
        align: 'center',
      });
    }

    const fileName =
      exportOption === 'all'
        ? `agences_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `agences_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.filteredAgences || this.filteredAgences.length === 0) {
      alert('Aucune agence à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all'
        ? this.filteredAgences
        : this.displayedAgences;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    // Préparation des données
    const formattedData = dataToExport.map((agence, index) => ({
      '#':
        exportOption === 'all'
          ? index + 1
          : (this.page - 1) * this.pageSize + index + 1,
      Nom: agence.nom,
      Sigle: agence.sigle,
      Direction: agence.directionDto?.sigle || '',
      Ville: agence.ville,
      Responsable: `${agence.responsable?.nom || ''} ${
        agence.responsable?.prenom || ''
      }`,
    }));

    // Ajout du total des directions exportées et de la date d'export en bas du fichier
    formattedData.push(
      { '#': 0, Nom: '', Sigle: '', Direction: '', Ville: '', Responsable: '' }, // Ligne vide
      {
        '#': 0,
        Nom: '',
        Sigle: "Total agences exportées : ",
        Direction: '',
        Ville: totalElements.toString(),
        Responsable: '',
      },
      {
        '#': 0,
        Nom: '',
        Sigle: "Date d'export:",
        Direction: '',
        Ville: currentDate,
        Responsable: '',
      }
    );

    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agences');

    // Nom du fichier
    const fileName =
      exportOption === 'all'
        ? `agences_complete_${currentDate.replace(/[/,:]/g, '_')}.xlsx`
        : `agences_page_${currentDate.replace(/[/,:]/g, '_')}.xlsx`;

    // Enregistrement du fichier
    XLSX.writeFile(workbook, fileName);
  }
}
