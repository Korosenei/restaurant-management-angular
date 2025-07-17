import { TICKET } from "../model-elements/ticket.model";
import { RESTAURANT } from "../model-restos/restaurant.model";
import { AGENCE } from "../model-structures/agence.model";
import { DIRECTION } from "../model-structures/direction.model";

export class USER {
  id: number = 0;
  matricule: string = '';
  nom: string = '';
  prenom: string = '';
  civilite: Civilite = Civilite.M;
  piece: Piece = Piece.CNIB;
  numPiece: string = '';
  nip: string = '';
  telephone: number = 0;
  email: string = '';
  motDePasse: string = '';
  accountLocked: boolean = false;
  enabled: boolean = true; // Défaut à true
  role: RoleName = RoleName.CLIENT;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  lastLogin: Date = new Date();
  lastLogout: Date = new Date();
  deleted: boolean = false;

  // Relations - gardées pour compatibilité frontend
  tickets: TICKET[] = [];
  directionId: number = 0;
  direction: DIRECTION = new DIRECTION();
  agenceId: number = 0;
  agence: AGENCE = new AGENCE();
  restoId: number = 0;
  resto: RESTAURANT = new RESTAURANT();

  constructor(init?: Partial<USER>) {
    Object.assign(this, init);
  }
}

export enum RoleName {
  USER = 'USER',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  AUTRE = 'AUTRE',
}

export enum Piece {
  CNIB = 'CNIB',
  PASSPORT = 'PASSPORT',
}

export enum Civilite {
  M = 'M',        // Changé pour correspondre au backend
  MME = 'MME',    // Changé pour correspondre au backend
}

// Fonction utilitaire pour obtenir le label de la civilité
export function getCiviliteLabel(civilite: Civilite): string {
  switch (civilite) {
    case Civilite.M:
      return 'Monsieur';
    case Civilite.MME:
      return 'Madame';
    default:
      return '';
  }
}

// Fonction utilitaire pour obtenir le label de la pièce
export function getPieceLabel(piece: Piece): string {
  switch (piece) {
    case Piece.CNIB:
      return 'CNIB';
    case Piece.PASSPORT:
      return 'Passeport';
    default:
      return '';
  }
}
