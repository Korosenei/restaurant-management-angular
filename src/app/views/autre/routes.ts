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
        redirectTo: 'notification',
        pathMatch: 'full'
      },
      {
        path: 'notification',
        loadComponent: () => import('./notification/notification.component').then(m => m.NotificationComponent),
        data: {
          title: 'Notification'
        }
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
        data: {
          title: 'Profile'
        }
      }
    ]
  }
];

