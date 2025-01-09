import { Routes } from '@angular/router';
import { NewBanqueComponent } from '../composants/page-nouvel-element/new-banque/new-banque.component';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paiement'
    },
    children: [
      {
        path: '',
        redirectTo: 'banque',
        pathMatch: 'full'
      },
      {
        path: 'banque',
        loadComponent: () => import('./banque/banque.component').then(m => m.BanqueComponent),
        data: {
          title: 'Banque'
        }
      },
      {
        path: 'cheque',
        loadComponent: () => import('./cheque/cheque.component').then(m => m.ChequeComponent),
        data: {
          title: 'Chèque'
        }
      },
      {
        path: 'demande',
        loadComponent: () => import('./demande/demande.component').then(m => m.DemandeComponent),
        data: {
          title: 'Demande'
        }
      },
      {
        path: 'ticket',
        loadComponent: () => import('./ticket/ticket.component').then(m => m.TicketComponent),
        data: {
          title: 'Ticket'
        }
      },
      {
        path: 'registre',
        loadComponent: () => import('./registre/registre.component').then(m => m.RegistreComponent),
        data: {
          title: 'E-registre'
        }
      }
    ]
  }
];

