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

    // Filtrer par texte (nom, sigle, région, ville, responsable)
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (direction) =>
          direction.nom.toLowerCase().includes(searchLower) ||
          direction.sigle.toLowerCase().includes(searchLower) ||
          direction.region.toLowerCase().includes(searchLower) ||
          direction.ville.toLowerCase().includes(searchLower) ||
          direction.responsable?.nom.toLowerCase().includes(searchLower) ||
          false ||
          direction.responsable?.prenom.toLowerCase().includes(searchLower) ||
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
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.page = 1; // Revenir à la première page après filtrage
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
    if (!this.filteredDirections || this.filteredDirections.length === 0) {
      alert('Aucune direction à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all' ? this.filteredDirections : this.displayedDirections;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
    doc.setFontSize(14);
    doc.text('Liste des Directions', 105, 15, { align: 'center' });

    // Préparation des données pour le tableau
    const headers = [['#', 'Nom', 'Sigle', 'Région', 'Ville', 'Responsable']];
    const data = dataToExport.map((direction, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
      direction.nom,
      direction.sigle,
      direction.region,
      direction.ville,
      `${direction.responsable?.nom || ''} ${direction.responsable?.prenom || ''}`,
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

      // Total des directions exportées en bas à droite
      doc.text(`Total des directions exportées: ${totalElements}`, 140, pageHeight - 15);

      // Numérotation des pages au centre
      doc.text(`Page ${i} / ${pageCount}`, 105, pageHeight - 10, { align: 'center' });
    }

    const fileName =
      exportOption === 'all'
        ? `directions_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `directions_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.filteredDirections || this.filteredDirections.length === 0) {
      alert('Aucune direction à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all' ? this.filteredDirections : this.displayedDirections;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    // Préparation des données
    const formattedData = dataToExport.map((direction, index) => ({
      '#':
        exportOption === 'all'
          ? index + 1
          : (this.page - 1) * this.pageSize + index + 1,
      Nom: direction.nom,
      Sigle: direction.sigle,
      Région: direction.region,
      Ville: direction.ville,
      Responsable: `${direction.responsable?.nom || ''} ${direction.responsable?.prenom || ''}`,
    }));

    // Ajout du total des directions exportées et de la date d'export en bas du fichier
    formattedData.push(
      { '#': 0, Nom: '', Sigle: '', Région: '', Ville: '', Responsable: '' },
      { '#': 0, Nom: '', Sigle: 'Total directions exportées:', Région: '', Ville: totalElements.toString(), Responsable: '' },
      { '#': 0, Nom: '', Sigle: 'Date d\'export:', Région: '', Ville: currentDate, Responsable: '' }
    );

    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Directions');

    // Nom du fichier
    const fileName =
      exportOption === 'all'
        ? `directions_complete_${currentDate.replace(/[/,:]/g, '_')}.xlsx`
        : `directions_page_${currentDate.replace(/[/,:]/g, '_')}.xlsx`;

    // Enregistrement du fichier
    XLSX.writeFile(workbook, fileName);
  }
}
