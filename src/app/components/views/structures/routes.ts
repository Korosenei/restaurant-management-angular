import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Structures'
    },
    children: [
      {
        path: '',
        redirectTo: 'directions',
        pathMatch: 'full'
      },
      {
        path: 'directions',
        loadComponent: () => import('./direction/direction.component').then(m => m.DirectionComponent),
        data: {
          title: 'Directions'
        }
      },
      {
        path: 'agences',
        loadComponent: () => import('./agence/agence.component').then(m => m.AgenceComponent),
        data: {
          title: 'Agences'
        }
      }
    ]
  }
];

