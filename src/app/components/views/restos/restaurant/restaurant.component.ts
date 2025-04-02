import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonActionComponent } from '../../../pages/buttons/button-action/button-action.component';
import { AddRestaurantComponent } from '../../../pages/page-add/add-restos/add-restaurant/add-restaurant.component';
import { PaginationComponent } from '../../../pages/pagination/pagination.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../pages/search/search.component';
import { RESTAURANT } from '../../../../models/model-restos/restaurant.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ButtonActionComponent,
    PaginationComponent,
    SearchComponent,
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
})
export class RestaurantComponent implements OnInit {
  restaurantObj: RESTAURANT = new RESTAURANT();

  listRestaurants: RESTAURANT[] = [];
  filteredRestaurants: RESTAURANT[] = [];
  displayedRestaurants: RESTAURANT[] = [];

  page = 1;
  pageSize = 5;
  totalItems = 0;

  searchTerm: string = '';
  selectedDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getRestaurants();
  }

  openModal() {
    this.modalService.open(AddRestaurantComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getRestaurants() {
    this.http.get<RESTAURANT[]>('http://localhost:2026/restos/all').subscribe({
      next: (res) => {
        this.listRestaurants = res;
        this.filteredRestaurants = [...res];
        this.totalItems = res.length;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restos', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.listRestaurants];

    if (this.searchTerm) {
      filtered = filtered.filter(
        (resto) =>
          resto.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          resto.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filtered = filtered.filter((resto) => {
        const restoDate = new Date(resto.creationDate);
        return (
          restoDate >= new Date(this.selectedStartDate) &&
          restoDate <= new Date(this.selectedEndDate)
        );
      });
    }

    this.filteredRestaurants = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedRoles();
  }

  updateDisplayedRoles() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedRestaurants = this.filteredRestaurants.slice(
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

  onEdite(data: RESTAURANT) {
    const modalRef = this.modalService.open(AddRestaurantComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.restaurantObj = { ...data };
    modalRef.componentInstance.listRestaurants = this.listRestaurants;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getRestaurants();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce restaurant ?')) {
      this.http.delete(`http://localhost:2026/restos/delete/${id}`).subscribe({
        next: () => {
          alert('Restaurant supprimé avec succès !');
          this.getRestaurants();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du restaurant', err);
          alert('Impossible de supprimer ce restaurant.');
        },
      });
    }
  }

  // Méthode pour l'export PDF
  exportToPDF() {
    if (!this.filteredRestaurants || this.filteredRestaurants.length === 0) {
      alert('Aucun restaurant à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les restaurants en PDF ?')) {
      const doc = new jsPDF();
      doc.text('Liste des restaurants', 10, 10);

      const headers = [['ID', 'Nom', 'Ville', 'Contact', 'Manager']];
      const data = this.filteredRestaurants.map((resto) => [
        resto.id,
        resto.ville,
        resto.nom,
        resto.telephone,
        resto.manager,
      ]);

      (doc as any).autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'grid',
      });

      doc.save('restaurants.pdf');
    }
  }

  // Exporter en Excel
  exportToExcel() {
    if (!this.listRestaurants || this.listRestaurants.length === 0) {
      alert('Aucun restaurant à exporter.');
      return;
    }

    if (confirm('Voulez-vous vraiment exporter les restaurants en Excel ?')) {
      const worksheet = XLSX.utils.json_to_sheet(this.listRestaurants);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Restaurants');
      XLSX.writeFile(workbook, 'restaurants.xlsx');
    }
  }
}
