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

    // Filtrer par texte (reference, nom, prenom, nbrTicket)
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (menu) =>
          menu.nom.toLowerCase().includes(searchLower) ||
        menu.description.toLowerCase().includes(searchLower) 
      );
    }

    // Filtrer par date (Assurez-vous que `creationDate` est bien formaté en `YYYY-MM-DD`)
    // Filtrage par plage de dates (creationDate et modifiedDate)
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);

      filtered = filtered.filter((menu) => {
        const createdDate = new Date(menu.creationDate);
        const modifiedDate = new Date(menu.modifiedDate);

        // Vérifier si la menu a été créée ou modifiée dans la plage
        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (modifiedDate >= startDate && modifiedDate <= endDate)
        );
      });
    }

    // Mettre à jour la liste filtrée et la pagination
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
    this.applyFilters();
  }

  onDateFilter(dateRange: { startDate: string; endDate: string }): void {
    this.selectedStartDate = dateRange.startDate;
    this.selectedEndDate = dateRange.endDate;
    this.page = 1;
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

  // Méthode pour formater la date en 'jj/MM/AAAA'
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Les mois commencent à 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }


  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredMenus || this.filteredMenus.length === 0) {
      alert('Aucun menu à exporter.');
      return;
    }

    const exportOption = this.chooseExportOption();
    if (exportOption === 'cancel') {
      alert('Exportation annulée.');
      return;
    }

    const dataToExport =
      exportOption === 'all'
        ? this.filteredMenus
        : this.displayedMenus;
    const totalElements = dataToExport.length;
    const currentDate = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Titre du document
  const title = 'Liste des Menus';
  const titleWidth = doc.getTextWidth(title); // Calculer la largeur du texte
  const pageWidth = doc.internal.pageSize.width; // Largeur de la page
  const xPosition = (pageWidth - titleWidth) / 2; // Calculer la position X pour centrer le titre

  doc.setFontSize(14);
  doc.text(title, xPosition, 15); // Centrer le titre

    // Préparation des données pour le tableau
    const headers = [
      [
        '#',
        'Date',
        'Image',
        'Nom',
        'Description',
        'Restaurant',
      ],
    ];
    const data = dataToExport.map((menu, index) => [
      exportOption === 'all'
        ? index + 1
        : (this.page - 1) * this.pageSize + index + 1,
      this.formatDate(menu.modifiedDate),
      menu.image,
      menu.nom,
      menu.description,
      `${menu.restaurant?.nom || 'Non défini'}`,
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

      // Total des menus exportées en bas à droite
      doc.text(
        `Total des menus exportées : ${totalElements}`,
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
        ? `menus_complete_${currentDate.replace(/[/,:]/g, '_')}.pdf`
        : `menus_page_${currentDate.replace(/[/,:]/g, '_')}.pdf`;

    doc.save(fileName);
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
