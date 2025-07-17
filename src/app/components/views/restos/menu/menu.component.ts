import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddMenuComponent } from '../../../pages/page-add/add-restos/add-menu/add-menu.component';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MENU } from '../../../../models/model-restos/menu.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddMenuComponent,
    ButtonActionComponent,
    PaginationComponent,
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

  menuItems: MENU[] = [];
  currentWeek: number = 29;
  currentYear: number = 2025;
  weekDays: { date: Date, day: string, dayShort: string }[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  openModal() {
    const modalRef = this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.weekNumber = this.currentWeek;
    modalRef.componentInstance.year = this.currentYear;

    modalRef.result.then((result) => {
      if (result) {
        this.handleModalResult(result);
      }
    }).catch(() => {
      // Modal fermée sans action
    });
  }

  ngOnInit() {
    this.generateWeekDays();
    this.loadMenuItems();
  }

  generateWeekDays() {
    const year = this.currentYear;
    const weekNum = this.currentWeek;

    // Calculer le premier jour de la semaine
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNum - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);

    // Ajuster pour avoir le lundi comme premier jour
    const monday = new Date(firstDayOfWeek);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    this.weekDays = [];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const dayShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);

      this.weekDays.push({
        date: currentDate,
        day: dayNames[i],
        dayShort: dayShort[i]
      });
    }
  }

  loadMenuItems() {
    this.http.get<MENU[]>('http://localhost:2026/menus/all').subscribe({
      next: (res) => {
        this.listMenus = res;
        this.filteredMenus = [...res];
        this.totalItems = res.length;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des menus', err);
      },
    });
  }

  openEditMenuModal(menuItem: MENU) {
    const modalRef = this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.menuItem = { ...menuItem };
    modalRef.componentInstance.weekNumber = this.currentWeek;
    modalRef.componentInstance.year = this.currentYear;

    modalRef.result.then((result) => {
      if (result) {
      }
    }).catch(() => {
      // Modal fermée sans action
    });
  }

  handleModalResult(result: any, editId?: string) {
    const { action, data } = result;

    if (action === 'save') {
      this.saveMenuItem(data, editId);
    } else if (action === 'save-and-new') {
      this.saveMenuItem(data, editId);
      // Rouvrir le modal pour ajouter un nouveau plat
      setTimeout(() => {
        this.openModal();
      }, 100);
    }
  }

  saveMenuItem(data: any, editId?: string) {
    if (editId) {
      // Modification
      const index = this.menuItems.findIndex(item => item.id);
      if (index !== -1) {
        this.menuItems[index] = { ...this.menuItems[index], ...data };
      }
    } else {
      // Création
      const newItem: MENU = {
        id: this.generateId(),
        ...data
      };
      this.menuItems.push(newItem);
    }

    console.log('Menu sauvegardé:', data);
  }

  deleteMenuItem(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      this.menuItems = this.menuItems.filter(item => item.id);
    }
  }

  getMenuItemsForDate(date: Date): MENU[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.menuItems.filter(item => item.dateJour === dateStr);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  toggleAvailability(item: MENU) {
    item.isDisponible = !item.isDisponible;
    console.log('Disponibilité changée:', item);
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
      `${menu.restaurantDto?.nom || 'Non défini'}`,
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
