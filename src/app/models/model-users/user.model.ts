import { TICKET } from "../model-elements/ticket.model";
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
  tickets: TICKET[] = [];
  directionId: number = 0;
  direction: DIRECTION = new DIRECTION();
  agenceId: number = 0;
  agence: AGENCE = new AGENCE();
  restoId: number = 0;
  enabled: boolean = false;
  accountLocked: boolean = false;
  role: RoleName = RoleName.CLIENT;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  lastLogin: Date = new Date();
  lastLogout: Date = new Date();
  deleted: boolean = false;

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
  M = 'Monsieur',
  MME = 'Madame',
}
