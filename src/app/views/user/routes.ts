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
        redirectTo: 'employe',
        pathMatch: 'full'
      },
      {
        path: 'employe',
        loadComponent: () => import('./employe/employe.component').then(m => m.EmployeComponent),
        data: {
          title: 'Employé'
        }
      },
      {
        path: 'gerant',
        loadComponent: () => import('./gerant/gerant.component').then(m => m.GerantComponent),
        data: {
          title: 'Gérant'
        }
      },
      {
        path: 'client',
        loadComponent: () => import('./client/client.component').then(m => m.ClientComponent),
        data: {
          title: 'Client'
        }
      }
    ]
  }
];

