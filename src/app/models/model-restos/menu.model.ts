import { RESTAURANT } from "./restaurant.model";
import { USER } from "../model-users/user.model";

export class MENU {
  id: number = 0;
  nom: string = '';
  description: string = '';
  quantite: number = 1;
  image: string = '';
  isDisponible: boolean = true;
  dateJour: string = '';

  // Relations avec d'autres entités
  restaurantDto: RESTAURANT | null = null;
  creerPar: USER | null = null;
  creerParId: number | null = null;

  // Métadonnées
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  isDeleted: boolean = false;

  constructor(init?: Partial<MENU>) {
    if (init) {
      Object.assign(this, init);

      // Conversion des dates si elles sont des strings
      if (typeof init.creationDate === 'string') {
        this.creationDate = new Date(init.creationDate);
      }
      if (typeof init.modifiedDate === 'string') {
        this.modifiedDate = new Date(init.modifiedDate);
      }
    }
  }

  /**
   * Méthode pour obtenir le nom complet du créateur
   */
  get creerParNomComplet(): string {
    if (this.creerPar) {
      return `${this.creerPar.prenom} ${this.creerPar.nom}`;
    }
    return 'Utilisateur inconnu';
  }

  /**
   * Méthode pour obtenir le nom du restaurant
   */
  get restaurantNom(): string {
    return this.restaurantDto?.nom || 'Restaurant non défini';
  }

  /**
   * Méthode pour formater la date du jour
   */
  get dateJourFormatted(): string {
    if (!this.dateJour) return '';

    const date = new Date(this.dateJour);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Méthode pour obtenir le jour de la semaine
   */
  get jourSemaine(): string {
    if (!this.dateJour) return '';

    const date = new Date(this.dateJour);
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return jours[date.getDay()];
  }

  /**
   * Méthode pour vérifier si le menu est disponible aujourd'hui
   */
  get isAvailableToday(): boolean {
    if (!this.isDisponible) return false;

    const today = new Date().toISOString().split('T')[0];
    return this.dateJour === today;
  }

  /**
   * Méthode pour vérifier si le menu est périmé
   */
  get isExpired(): boolean {
    if (!this.dateJour) return false;

    const menuDate = new Date(this.dateJour);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return menuDate < today;
  }

  /**
   * Méthode pour obtenir le statut du menu
   */
  get status(): 'available' | 'unavailable' | 'expired' | 'deleted' {
    if (this.isDeleted) return 'deleted';
    if (this.isExpired) return 'expired';
    if (!this.isDisponible) return 'unavailable';
    return 'available';
  }

  /**
   * Méthode pour obtenir le badge de statut
   */
  get statusBadge(): { text: string; class: string } {
    switch (this.status) {
      case 'available':
        return { text: 'Disponible', class: 'badge-success' };
      case 'unavailable':
        return { text: 'Indisponible', class: 'badge-warning' };
      case 'expired':
        return { text: 'Expiré', class: 'badge-secondary' };
      case 'deleted':
        return { text: 'Supprimé', class: 'badge-danger' };
      default:
        return { text: 'Inconnu', class: 'badge-secondary' };
    }
  }

  /**
   * Méthode pour formater la date de création
   */
  get creationDateFormatted(): string {
    return this.creationDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Méthode pour formater la date de modification
   */
  get modifiedDateFormatted(): string {
    return this.modifiedDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Méthode pour obtenir l'URL de l'image par défaut
   */
  get imageUrl(): string {
    if (this.image) {
      // Si l'image est un chemin relatif, on peut ajouter le base URL
      if (this.image.startsWith('http')) {
        return this.image;
      }
      // Adapter selon votre configuration d'images
      return `http://localhost:2026/images/${this.image}`;
    }
    // Image par défaut
    return '/assets/images/default-menu.jpg';
  }

  /**
   * Méthode pour valider les données du menu
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this.nom || this.nom.trim().length < 2) {
      errors.push('Le nom du menu doit contenir au moins 2 caractères');
    }

    if (!this.description || this.description.trim().length < 4) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (!this.quantite || this.quantite < 1) {
      errors.push('La quantité doit être supérieure à 0');
    }

    if (!this.dateJour) {
      errors.push('La date du menu est obligatoire');
    }

    if (!this.creerPar && !this.creerParId) {
      errors.push('Le créateur du menu est requis');
    }

    return errors;
  }

  /**
   * Méthode pour cloner le menu
   */
  clone(): MENU {
    return new MENU({
      nom: this.nom,
      description: this.description,
      quantite: this.quantite,
      image: this.image,
      isDisponible: this.isDisponible,
      restaurantDto: this.restaurantDto,
      creerPar: this.creerPar,
      creerParId: this.creerParId
    });
  }

  /**
   * Méthode pour convertir en objet simple (pour l'envoi API)
   */
  toApiObject(): any {
    return {
      id: this.id || undefined,
      nom: this.nom.trim(),
      description: this.description.trim(),
      quantite: this.quantite,
      image: this.image || null,
      isDisponible: this.isDisponible,
      dateJour: this.dateJour,
      restaurantDto: this.restaurantDto,
      creerPar: this.creerPar,
      creerParId: this.creerParId,
      creationDate: this.creationDate.toISOString(),
      modifiedDate: this.modifiedDate.toISOString(),
      isDeleted: this.isDeleted
    };
  }

  /**
   * Méthode statique pour créer un menu à partir de données API
   */
  static fromApiResponse(data: any): MENU {
    return new MENU({
      id: data.id,
      nom: data.nom,
      description: data.description,
      quantite: data.quantite,
      image: data.image,
      isDisponible: data.isDisponible,
      dateJour: data.dateJour,
      restaurantDto: data.restaurantDto,
      creerPar: data.creerPar,
      creerParId: data.creerParId,
      creationDate: data.creationDate ? new Date(data.creationDate) : new Date(),
      modifiedDate: data.modifiedDate ? new Date(data.modifiedDate) : new Date(),
      isDeleted: data.isDeleted || false
    });
  }
}
