import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPLOYE } from '../../page-nouvel-user/new-employe/employe.model';
import { NewEmployeComponent } from '../../page-nouvel-user/new-employe/new-employe.component';
import { EmployeDetailModalComponent } from '../../button-detail/employe-detail-modal/employe-detail-modal.component';
import { EmployeService } from 'src/app/services/employes/employe.service';

@Component({
  selector: 'app-detail-employe',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './detail-employe.component.html',
  styleUrl: './detail-employe.component.scss'
})
export class DetailEmployeComponent implements OnInit  {
  // Objet EMPLOYE
  employeObj: EMPLOYE = new EMPLOYE();
  listEmployes: EMPLOYE[] = [];
  selectedEmploye: EMPLOYE | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getEmployes()
  }

  getEmployes() {
    this.http.get<EMPLOYE[]>('http://localhost:3000/employes').subscribe({
      next: (res) => {
        this.listEmployes = res;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des gérants", err);
      }
    });
  }

  onDetail(employe: EMPLOYE) {
    const modalRef = this.modalService.open(EmployeDetailModalComponent, {
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    });
    modalRef.componentInstance.employe = employe;

    modalRef.result.then(
      (result) => {
        console.log('Modal fermé avec:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }


  onEdite(data: EMPLOYE) {
    const modalRef = this.modalService.open(NewEmployeComponent, { size: 'lg',
      backdrop: 'static', // Désactive la fermeture en cliquant en dehors
      keyboard: false    // Désactive la fermeture avec la touche 'Échap' ;
    })
    modalRef.componentInstance.employeObj = { ...data }; // Crée une copie pour éviter la mutation directe

    modalRef.result.then(
      (result) => {
        if (result === 'updated' || result === 'created') {
          // Récupérer la liste mise à jour des employés
          this.getEmployes; // Recharger la liste des employés depuis le serveur
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  // Méthode pour supprimer un employé
  onDelete(id: number) {
    const employeToDelete = this.listEmployes.find((employe) => employe.id === id);
    if (!employeToDelete) {
      alert("L'employé n'a pas été trouvé.");
      return;
    }
    // Récupérer l'employé à supprimer
    const isDelete = confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employeToDelete.nom} ${employeToDelete.prenom} ?`);

    if (isDelete) {

      if (employeToDelete) {
        // Ajouter l'employé à la collection deletedEmploye
        this.http
          .post<EMPLOYE>('http://localhost:3000/deleteEmploye', employeToDelete)
          .subscribe({
            next: (res) => {
              // Supprimer l'employé de la liste active
              this.listEmployes = this.listEmployes.filter(
                (employe) => employe.id !== id
              );

              // Optionnel : Vous pouvez supprimer l'employé de la collection originale si vous le souhaitez
              this.http
                .delete<EMPLOYE>(`http://localhost:3000/employes/${id}`)
                .subscribe({
                  next: () => {
                    alert('EMPLOYE supprimé de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression de l'employé dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement de l'employé vers deletedBank",
                err
              );
            },
          });
      } else {
        alert("L'Employé n'a pas été trouvé.");
      }
    } else {
      alert("La suppression de l'employé est annulé.");
    }
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('Key down', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key up', event.key);
  }
}

