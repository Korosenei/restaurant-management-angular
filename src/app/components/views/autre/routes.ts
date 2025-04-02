import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paramètres'
    },
    children: [
      {
        path: '',
        redirectTo: 'compte',
        pathMatch: 'full'
      },
      {
        path: 'compte',
        loadComponent: () => import('./compte/compte.component').then(m => m.CompteComponent),
        data: {
          title: 'Mon Compte'
        }
      },
      {
        path: 'configurations',
        loadComponent: () => import('./configuration/configuration.component').then(m => m.ConfigurationComponent),
        data: {
          title: 'Configurations'
        }
      }
    ]
  }
];

