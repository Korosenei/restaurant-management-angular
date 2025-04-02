import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PARAMSACHAT } from '../../../../models/model-elements/paramsAchat.model';
import { AddParamsAchatComponent } from '../../../pages/page-add/add-elements/add-params-achat/add-params-achat.component';

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
        // Vérifie les informations supplémentaires (modifié par)
        if (this.configObj.modifiedBy) {
          console.log('Dernière modification par:', this.configObj.modifiedBy);
        }
      },
      error: (err) => {
        console.error(
          'Erreur lors de la récupération des données de configuration',
          err
        );
      },
    });
  }

  onEdite(data: PARAMSACHAT) {
    const modalRef = this.modalService.open(AddParamsAchatComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.configObj = { ...data };
    modalRef.componentInstance.listConfigs = this.listConfigs;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getParametres();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }
}
