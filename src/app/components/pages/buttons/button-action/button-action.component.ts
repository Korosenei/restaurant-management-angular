import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-action.component.html',
  styleUrl: './button-action.component.scss'
})
export class ButtonActionComponent {

  @Input() isNouveauVisible = true;
  @Input() isExporterVisible = true;
  @Input() isImporterVisible = true;

  @Output() addClicked = new EventEmitter<void>();
  @Output() exportClicked = new EventEmitter<void>();
  @Output() importClicked = new EventEmitter<void>();

  onAdd() {
    this.addClicked.emit();
  }

  onExport() {
    this.exportClicked.emit();
  }

  onImport() {
    this.importClicked.emit();
  }
}
