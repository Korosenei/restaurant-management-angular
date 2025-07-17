import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion des Restaurants'
    },
    children: [
      {
        path: '',
        redirectTo: 'restaurants',
        pathMatch: 'full'
      },
      {
        path: 'restaurants',
        loadComponent: () => import('./restaurant/restaurant.component').then(m => m.RestaurantComponent),
        data: {
          title: 'Restaurants'
        }
      },
      {
        path: 'menus',
        loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent),
        data: {
          title: 'Menus'
        }
      },
      {
        path: 'reservations',
        loadComponent: () => import('./reservation/reservation.component').then(m => m.ReservationComponent),
        data: {
          title: 'Reservations'
        }
      },
      {
        path: 'consommations',
        loadComponent: () => import('./consommation/consommation.component').then(m => m.ConsommationComponent),
        data: {
          title: 'Consommations'
        }
      },
      {
        path: 'programmations',
        loadComponent: () => import('./programmation/programmation.component').then(m => m.ProgrammationComponent),
        data: {
          title: 'Programmations'
        }
      }
    ]
  }
];

