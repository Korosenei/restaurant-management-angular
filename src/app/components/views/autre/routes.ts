import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Autre'
    },
    children: [
      {
        path: '',
        redirectTo: 'notifications',
        pathMatch: 'full'
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notification/notification.component').then(m => m.NotificationComponent),
        data: {
          title: 'Notifications'
        }
      },
      {
        path: 'compte',
        loadComponent: () => import('./compte/compte.component').then(m => m.CompteComponent),
        data: {
          title: 'Mon Compte'
        }
      }
    ]
  }
];

