import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'newBanque',
    loadComponent: () => import('./page-nouvel-element/new-banque/new-banque.component').then(m => m.NewBanqueComponent),
    data: {
      title: `New Banque`
    }
  }
];

