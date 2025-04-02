import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USER } from '../../../../models/model-users/user.model';
import { ChangePwdUser } from '../../../../models/model-users/ChangePwdUser.model';
@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss',
})
export class CompteComponent implements OnInit {
  user: USER = new USER();
  currentUser: USER | null = null;
  token: string | null = '';
  updateUserData: USER = new USER();
  changePwdUser: ChangePwdUser = {
    userId: 0,
    lastPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    modifiedDate: ''
  };
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    /* this.token = localStorage.getItem('token');
    if (this.token) {
      this.getCurrentUser();
    } */
    this.getUser();
  }

  // Récupération de l'utilisateur connecté depuis le LocalStorage
  getUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.changePwdUser.userId = this.user.id;
    } else {
      this.errorMessage = 'Utilisateur non trouvé!';
    }
  }

  // Méthode pour changer le mot de passe
  changePassword(): void {
    if (this.changePwdUser.newPassword !== this.changePwdUser.confirmNewPassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }

    this.http.put(`http://localhost:2028/users/${this.changePwdUser.userId}/update-password`, this.changePwdUser).subscribe(
      () => {
        alert('Mot de passe modifié avec succès!');
        this.errorMessage = '';
      },
      () => {
        this.errorMessage = 'Erreur lors de la modification du mot de passe.';
      }
    );
  }
}
