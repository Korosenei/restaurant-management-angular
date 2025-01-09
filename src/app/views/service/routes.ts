import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Services'
    },
    children: [
      {
        path: '',
        redirectTo: 'direction',
        pathMatch: 'full'
      },
      {
        path: 'direction',
        loadComponent: () => import('./direction/direction.component').then(m => m.DirectionComponent),
        data: {
          title: 'Direction'
        }
      },
      {
        path: 'agence',
        loadComponent: () => import('./agence/agence.component').then(m => m.AgenceComponent),
        data: {
          title: 'Agence'
        }
      },
      {
        path: 'club',
        loadComponent: () => import('./club/club.component').then(m => m.ClubComponent),
        data: {
          title: 'Club'
        }
      }
    ]
  }
];

