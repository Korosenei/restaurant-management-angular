import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss'
})
export class CompteComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  modifierMotDePasse(): void{
    this.router.navigate(['changermotdepasse']);
  }
}
