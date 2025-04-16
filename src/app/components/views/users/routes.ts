import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Utilisateurs'
    },
    children: [
      {
        path: '',
        redirectTo: 'utilisateurs',
        pathMatch: 'full'
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./utilisateur/utilisateur.component').then(m => m.UtilisateurComponent),
        data: {
          title: 'Utilisateurs'
        }
      },
      {
        path: 'clients',
        loadComponent: () => import('./employe/employe.component').then(m => m.EmployeComponent),
        data: {
          title: 'Clients'
        }
      },
      {
        path: 'caissiers',
        loadComponent: () => import('./caissier/caissier.component').then(m => m.CaissierComponent),
        data: {
          title: 'Caissiers'
        }
      },
      {
        path: 'managers',
        loadComponent: () => import('./manager/manager.component').then(m => m.ManagerComponent),
        data: {
          title: 'Managers'
        }
      },
    ]
  }
];

