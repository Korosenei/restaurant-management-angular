import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  // Labels personnalisables pour le champ de recherche et les dates
  @Input() searchPlaceholder: string = 'Recherche...';
  @Input() showDateFilters: boolean = false; // Permet d'afficher ou masquer les filtres de date

  // Variables liées aux champs du formulaire
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';

  // Événements émis vers le composant parent
  @Output() search = new EventEmitter<string>(); 
  @Output() filterByDate = new EventEmitter<{ startDate: string, endDate: string }>(); 

  // Émettre l'événement de recherche
  onSearch() {
    this.search.emit(this.searchTerm);
  }

  // Émettre l'événement de filtrage par date
  onDateFilter() {
    this.filterByDate.emit({ startDate: this.startDate, endDate: this.endDate });
  }
}
