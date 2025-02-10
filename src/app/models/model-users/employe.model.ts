import { ROLE } from "./role.model";

export class EMPLOYE {
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
  agenceId: string = '';
  restoId: string = '';
  enabled: boolean = false;
  accountLocked: boolean = false;
  role: ROLE| null = null;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<EMPLOYE>) {
    Object.assign(this, init);
  }
}

export enum Piece {
  CNIB = 'CNIB',
  PASSPORT = 'PASSPORT',
}

export enum Civilite {
  M = 'Monsieur',
  MME = 'Madame',
}
