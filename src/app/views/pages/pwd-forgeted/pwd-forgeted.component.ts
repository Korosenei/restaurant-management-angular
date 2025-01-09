import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pwd-forgeted',
  standalone: true,
  imports: [],
  templateUrl: './pwd-forgeted.component.html',
  styleUrl: './pwd-forgeted.component.scss'
})
export class PwdForgetedComponent {

  constructor(private router: Router) { }

  onConnexionClick() {
    this.router.navigate(['/login']);
  }
}
