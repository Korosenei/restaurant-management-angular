import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CHEQUE } from './cheque.model';
import { BANK } from '../new-banque/banque.model';
import { DEMANDE } from '../new-demande/demande.model';

@Component({
  selector: 'app-new-cheque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormModule
  ],
  templateUrl: './new-cheque.component.html',
  styleUrl: './new-cheque.component.scss',
})
export class NewChequeComponent implements OnInit {

  // Objet CHEQUE
  listCheques: CHEQUE[] = [];
  chequeForm!: FormGroup;
  @Input() chequeObj: CHEQUE = new CHEQUE();

  // Objet BANQUE & DEMANDE
  listBanks: BANK[] = [];
  listDemandes: DEMANDE[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getBanks();
    this.getDemandes();
  }

  initializeForm(): void {
    this.chequeForm = this.formBuilder.group({
      dateEtablissement: [{ value: new Date(), disabled: true }],
      numero: [this.chequeObj.numero, Validators.required],
      montant: [this.chequeObj.montant, [Validators.required, Validators.min(0)]],
      refDemande: [this.chequeObj.refDemande, Validators.required],
      banque: [this.chequeObj.banque, Validators.required]
    });
  }

  // Validateur personnalisé pour vérifier que le montant est au moins 5 000 000
  montantMinimalValidator(control: AbstractControl): ValidationErrors | null {
    const montant = control.value;
    return montant < 5000000 ? { montantMinimal: true } : null;
  }

  getBanks() {
    this.http.get<BANK[]>('http://localhost:3000/banques').subscribe({
      next: (res) => {
        this.listBanks = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des banques", err);
      }
    });
  }

  getDemandes() {
    this.http.get<DEMANDE[]>('http://localhost:3000/demandes').subscribe({
      next: (res) => {
        this.listDemandes = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des demandes", err);
      }
    });
  }

  onDemandeChange(event: any) {
    const selectedReference = event.target.value;
    const selectedDemande = this.listDemandes.find(demande => demande.reference === selectedReference);
    if (selectedDemande) {
      this.chequeForm.patchValue({
        montant: selectedDemande.ticketDto.montant,
      });
    }
  }

  close(): void {
    this.activeModal.close();
  }

  save() {
    if (this.chequeForm.valid) {
      this.chequeObj = { ...this.chequeObj, ...this.chequeForm.value }; // Met à jour chequeObj avec les valeurs du formulaire

      let request$;

      if (this.chequeObj.id) {
        // Mise à jour du chèque existant
        request$ = this.http.put<CHEQUE>(
          `http://localhost:3000/cheques/${this.chequeObj.id}`,
          this.chequeObj
        );
      } else {
        // Création d'un nouvel chèque
        request$ = this.http.post<CHEQUE>(
          'http://localhost:3000/cheques',
          this.chequeObj
        );
      }

      request$.subscribe({
        next: (res) => {
          console.log(
            `chèque ${
              this.chequeObj.id ? 'mise à jour' : 'créé'
            } avec succès`,
            res
          );
          this.activeModal.close(this.chequeObj.id ? 'updated' : 'created'); // Ferme le modal avec le résultat approprié
        },
        error: (err) => {
          console.error("Erreur lors de l'opération", err);
          alert(
            `Erreur lors de l'opération: ${
              err.message || 'Veuillez réessayer plus tard'
            }`
          );
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }
}
