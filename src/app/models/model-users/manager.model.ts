export class MANAGER {
  public id: number;
  public matricule: string;
  public typePiece: TypePiece;
  public numCnib: string;
  public nipCnib: string;
  public numPassport: string;
  public nom: string;
  public prenom: string;
  public genre: Genre;
  public email: string;
  public telephone: string;

  constructor() {
    this.id = 0;
    this.matricule = '';
    this.typePiece = TypePiece.CNIB;
    this.numCnib = '';
    this.nipCnib = '';
    this.numPassport = '';
    this.nom = '';
    this.prenom = '';
    this.genre = Genre.HOMME;
    this.email = '';
    this.telephone = '';
  }
}

export enum Genre {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

export enum TypePiece {
  CNIB = 'CNIB',
  PASSPORT = 'PASSPORT',
}
