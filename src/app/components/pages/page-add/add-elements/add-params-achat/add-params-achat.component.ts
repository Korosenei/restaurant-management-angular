import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PARAMSACHAT } from '../../../../../models/model-elements/paramsAchat.model';

@Component({
  selector: 'app-add-params-achat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-params-achat.component.html',
  styleUrl: './add-params-achat.component.scss',
})
export class AddParamsAchatComponent implements OnInit {
  configForm!: FormGroup;
  defaultConfig: PARAMSACHAT = new PARAMSACHAT();
  errors: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Initialiser le formulaire avec les valeurs par défaut
  }

  /// Initialiser le formulaire avec les valeurs par défaut
  initializeForm(): void {
    this.configForm = this.formBuilder.group({
      prixTicket: [
        this.defaultConfig.prixTicket,
        [Validators.required, Validators.min(100)],
      ],
      minTicketParTransaction: [
        this.defaultConfig.minTicketParTransaction,
        [Validators.required, Validators.min(1)],
      ],
      maxAchatParClient: [
        this.defaultConfig.maxAchatParClient,
        [Validators.required, Validators.min(1)],
      ],
      minTicketParTransactionMensuelle: [
        this.defaultConfig.minTicketParTransactionMensuelle,
        [Validators.required, Validators.min(1)],
      ],
      dateDebut: [this.defaultConfig.dateDebut, Validators.required],
      dateFin: [this.defaultConfig.dateFin, Validators.required],
    });
  }

  save() {
    if (this.configForm.valid) {
      const formValue = this.configForm.value;
      const utilisateurConnecte = JSON.parse(
        localStorage.getItem('user') || '{}'
      );
      if (!utilisateurConnecte || !utilisateurConnecte.id) {
        console.error("❌ Aucun ID utilisateur trouvé ! L'utilisateur envoyé sera SYSTEM.");
      } else {
        console.log('Utilisateur connecté:', utilisateurConnecte);
      }

      const parametreAchatDto = {
        ...formValue,
        dateDebut: new Date(formValue.dateDebut).toISOString(),
        dateFin: new Date(formValue.dateFin).toISOString(),
        user: utilisateurConnecte, // ✅ Envoi de l'utilisateur correct
        modifiedDate: new Date().toISOString(),
      };

      console.log('🛠 Données envoyées au backend :', parametreAchatDto);

      this.http
        .put('http://localhost:2027/config/update', parametreAchatDto)
        .subscribe(
          () => {
            alert('Configuration mise à jour avec succès!');
            this.activeModal.close('updated');
          },
          (error) => console.error('❌ Erreur lors de la mise à jour :', error)
        );
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  // Fermer le modal sans sauvegarder
  Close(): void {
    this.activeModal.close();
  }
}
