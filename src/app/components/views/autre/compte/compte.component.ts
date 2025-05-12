import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { USER } from '../../../../models/model-users/user.model';
import { ChangePwdComponent } from '../change-pwd/change-pwd.component';
import { CHANGEPWD } from '../../../../models/model-users/ChangePwd.model';
@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss',
})
export class CompteComponent implements OnInit {
  currentUser: USER | null = null;
  currentDirection: any = null;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  // Récupération de l'utilisateur connecté depuis le LocalStorage
  getUser(): void {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      this.currentUser = JSON.parse(userFromStorage);

      const lastLogoutFromStorage = localStorage.getItem('lastLogout');
      if (lastLogoutFromStorage && this.currentUser) {
        this.currentUser.lastLogout = new Date(lastLogoutFromStorage);
      }

      if (this.currentUser?.direction.nom) {
        this.getDirection(this.currentUser.direction.id);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Récupérer la direction associée à l'utilisateur
  getDirection(directionId: number): void {
    const url = `http://localhost:2025/directions/${directionId}`;
    this.http.get(url).subscribe({
      next: (data) => {
        this.currentDirection = data; // Stocke la direction récupérée
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la direction', err);
      },
    });
  }

  changePassword(): void {
    if (!this.currentUser) {
      alert('Utilisateur non trouvé !');
      return;
    }

    const modalRef = this.modalService.open(ChangePwdComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    // Passer les informations de l'utilisateur connecté au modal
    modalRef.componentInstance.currentUser = this.currentUser;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getUser();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  // Méthode pour afficher une confirmation avant de se déconnecter
  confirmLogout(): void {
    const confirmAction = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?'
    );
    if (confirmAction) {
      this.logout();
    }
  }

  // Méthode de déconnexion
  logout(): void {
    if (this.currentUser) {
      // Enregistrer la date de la dernière déconnexion
      this.currentUser.lastLogout = new Date();

      // Sauvegarder la dernière déconnexion dans localStorage
      localStorage.setItem(
        'lastLogout',
        this.currentUser.lastLogout.toISOString()
      );
    }

    // Effacer les données utilisateur du localStorage
    localStorage.removeItem('user');

    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }
}
