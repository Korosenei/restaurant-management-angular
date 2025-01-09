
export class CLIENT {
  id: number;
  typePiece: TypePiece;
  cnibNumber: string;
  nipCnib: string;
  passportNumber: string;
  dateEtaPiece: Date;
  dateExpPiece: Date;
  nom: string;
  prenom: string;
  dateNaiss: Date;
  genre: Genre;
  email: string;
  telephone: string;
  ville: string;
  localite: string;

  constructor() {
    this.id = 0;
    this.typePiece = TypePiece.CNIB;
    this.cnibNumber = '';
    this.nipCnib = '';
    this.passportNumber = '';
    this.dateEtaPiece = new Date();
    this.dateExpPiece = new Date();
    this.nom = '';
    this.prenom = '';
    this.dateNaiss = new Date();
    this.genre = Genre.HOMME;
    this.email = '';
    this.telephone = '';
    this.ville = '';
    this.localite = '';
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
