import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PARAMSACHAT } from '../../../../models/model-elements/paramsAchat.model';
import { AddParamsAchatComponent } from '../../../pages/page-add/add-elements/add-params-achat/add-params-achat.component';
import { USER } from '../../../../models/model-users/user.model';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent implements OnInit {
  listConfigs: PARAMSACHAT[] = [];
  configObj: PARAMSACHAT = new PARAMSACHAT();

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getParametres();
  }

  openModal() {
    this.modalService.open(AddParamsAchatComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  getParametres() {
    this.http.get<PARAMSACHAT>('http://localhost:2027/config').subscribe({
      next: (res) => {
        console.log('Données récupérées:', res);
        this.configObj = res;

        if (this.configObj.user) {
          console.log('Dernière modification par:', this.configObj.user);
        } else {
          console.warn("L'utilisateur qui a modifié n'est pas récupéré.");
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données', err);
      },
    });
  }

  onEdite(data: PARAMSACHAT) {
    this.configObj = { ...data };

    // 🔍 Récupération de l'utilisateur connecté
    const utilisateurConnecte: USER = JSON.parse(localStorage.getItem('user') || '{}');

    if (!utilisateurConnecte || !utilisateurConnecte.id) {
      console.error("❌ Aucun ID utilisateur trouvé ! L'utilisateur envoyé sera SYSTEM.");
    } else {
      console.log("✅ Utilisateur connecté récupéré :", utilisateurConnecte);
    }

    // ✅ Envoi de l'utilisateur complet
    this.configObj.user = utilisateurConnecte;
    this.configObj.modifiedDate = new Date();  // ⬅ Correction du type

    this.modalService.open(AddParamsAchatComponent, {
      size: 'lg',
      backdrop: 'static',
    }).result.then((result) => {
      if (result === 'updated') {
        this.getParametres();
      }
    }).catch((err) => console.error('Erreur lors de l’ouverture du modal', err));
  }
}
