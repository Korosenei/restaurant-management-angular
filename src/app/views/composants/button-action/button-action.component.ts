import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-button-action',
  standalone: true,
  imports: [ButtonDirective, CommonModule],
  templateUrl: './button-action.component.html',
  styleUrl: './button-action.component.scss'
})
export class ButtonActionComponent {

  @Input()
  isNouveauVisible = true;
  @Input()
  isExporterVisible = true;
  @Input()
  isImporterVisible = true;
  
  @Output()
  addClicked = new EventEmitter<void>();

  onAdd(){
    this.addClicked.emit();
  }
}
