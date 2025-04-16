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
    iconComponent: { name: 'cilHome' }
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
    name: 'Utilisateurs',
    url: '/users/utilisateurs',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Clients',
    url: '/users/clients',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Caissiers',
    url: '/users/caissiers',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Managers',
    url: '/users/managers',
    iconComponent: { name: 'cil-user-female' }
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
    name: 'Paramètres'
  },
  {
    name: 'Mon Compte',
    url: '/parametres/compte',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Configurations',
    url: '/parametres/configurations',
    iconComponent: { name: 'cil-settings' }
  },
];
