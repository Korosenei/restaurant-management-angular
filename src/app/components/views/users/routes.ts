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
        redirectTo: 'allUsers',
        pathMatch: 'full'
      },
      {
        path: 'allUsers',
        loadComponent: () => import('./utilisateur/utilisateur.component').then(m => m.UtilisateurComponent),
        data: {
          title: 'All Users'
        }
      },
      {
        path: 'employes',
        loadComponent: () => import('./employe/employe.component').then(m => m.EmployeComponent),
        data: {
          title: 'Employés'
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

