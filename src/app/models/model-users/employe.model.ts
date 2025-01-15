
export class EMPLOYE{

  id: number;
  matricule: string;
  typePiece: string;
  numCnib: string;
  nipCnib: string;
  numPassport: string;
  nom: string;
  prenom: string;
  genre: Genre;
  email: string;
  telephone: string;
  role: Role;

  constructor() {
    this.id = 0;
    this.matricule = '';
    this.typePiece = '';
    this.numCnib = '';
    this.nipCnib = '';
    this.numPassport = '';
    this.nom = '';
    this.prenom = '';
    this.genre = Genre.HOMME;
    this.email = '';
    this.telephone = '';
    this.role = Role.USER;
  }
}

export enum TypePiece {
  CNIB = 'CNIB',
  PASSPORT = 'PASSPORT'
}

export enum Genre {
  HOMME = 'HOMME',
  FEMME = 'FEMME'
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}


