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
    url: '/tickets',
    iconComponent: { name: 'cilTag' }
  },
  {
    name: 'Consommations',
    url: '/tickets/consommations',
    iconComponent: { name: 'cil-chart' }
  },
  {
    name: 'Réservations',
    url: '/tickets/reservations',
    iconComponent: { name: 'cil-calendar' }
  },
  {
    name: 'Rapports Mensuels',
    url: '/tickets/rapports',
    iconComponent: { name: 'cilFile' }
  },

  {
    title: true,
    name: 'Gestion des Restaurants'
  },
  {
    name: 'Restaurants',
    url: '/restaurants',
    iconComponent: { name: 'cil-dining' }
  },
  {
    name: 'Prestataires Actuels',
    url: '/restaurants/prestataires',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Menu du Jour',
    url: '/restaurants/menu',
    iconComponent: { name: 'cil-spoon-knife' }
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
    name: 'Super Admin',
    url: '/users/super-admin',
    iconComponent: { name: 'cil-shield-alt' }
  },
  {
    name: 'Gérants Restaurants',
    url: '/users/gerants',
    iconComponent: { name: 'cil-user-female' }
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
    url: '/settings/notifications',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Profil',
    url: '/settings/profile',
    iconComponent: { name: 'cil-user' }
  },
];
