import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion des Tickets'
    },
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      },
      {
        path: 'tickets',
        loadComponent: () => import('./ticket/ticket.component').then(m => m.TicketComponent),
        data: {
          title: 'Tickets'
        }
      },
      {
        path: 'transactions',
        loadComponent: () => import('./transaction/transaction.component').then(m => m.TransactionComponent),
        data: {
          title: 'Transactions'
        }
      }
    ]
  }
];

