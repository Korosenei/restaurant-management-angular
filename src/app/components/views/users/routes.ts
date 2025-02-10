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
        redirectTo: 'employes',
        pathMatch: 'full'
      },
      {
        path: 'employes',
        loadComponent: () => import('./employe/employe.component').then(m => m.EmployeComponent),
        data: {
          title: 'Employés'
        }
      },
      {
        path: 'managers',
        loadComponent: () => import('./manager/manager.component').then(m => m.ManagerComponent),
        data: {
          title: 'Managers'
        }
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
        data: {
          title: 'Super-Admin'
        }
      },
      {
        path: 'roles',
        loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
        data: {
          title: 'Roles'
        }
      }
    ]
  }
];

