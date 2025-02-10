import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de bord',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },

  {
    title: true,
    name: 'Gestion des Tickets'
  },
  {
    name: 'Tickets',
    url: '/elements/tickets',
    iconComponent: { name: 'cilTag' }
  },
  {
    name: 'Transactions',
    url: '/elements/transactions',
    iconComponent: { name: 'cil-chart' }
  },

  {
    title: true,
    name: 'Gestion des Restaurants'
  },
  {
    name: 'Restaurants',
    url: '/restos/restaurants',
    iconComponent: { name: 'cil-restaurant' }
  },
  {
    name: 'Menu du Jour',
    url: '/restos/menus',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Réservations',
    url: '/restos/reservations',
    iconComponent: { name: 'cil-calendar' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Collapse',
        url: '/base/collapse',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Consommations',
    url: '/restos/consommations',
    iconComponent: { name: 'cil-calendar' }
  },

  {
    title: true,
    name: 'Utilisateurs'
  },
  {
    name: 'Employés',
    url: '/users/employes',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Restaurants Managers',
    url: '/users/managers',
    iconComponent: { name: 'cil-user-female' }
  },
  {
    name: 'Role',
    url: '/users/roles',
    iconComponent: { name: 'cil-lock-locked' }
  },


  {
    title: true,
    name: 'Structures'
  },
  {
    name: 'Directions',
    url: '/structures/directions',
    iconComponent: { name: 'cil-briefcase' }
  },
  {
    name: 'Agences',
    url: '/structures/agences',
    iconComponent: { name: 'cil-building' }
  },

  {
    title: true,
    name: 'Rapports et Suivi'
  },
  {
    name: 'Rapports Globaux',
    url: '/reports/global',
    iconComponent: { name: 'cil-chart-pie' }
  },
  {
    name: 'Évaluations Prestataires',
    url: '/reports/prestataires',
    iconComponent: { name: 'cil-star' }
  },

  {
    title: true,
    name: 'Paramètres'
  },
  {
    name: 'Notifications',
    url: '/autre/notifications',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Mon Compte',
    url: '/autre/compte',
    iconComponent: { name: 'cil-user' }
  },
];
