export class EMPLOYE {
  id: number = 0;
  matricule: string = '';
  typePiece: TypePiece = TypePiece.CNIB;
  numCnib: string = '';
  nipCnib: string = '';
  numPassport: string = '';
  nom: string = '';
  prenom: string = '';
  genre: Genre = Genre.HOMME;
  email: string = '';
  telephone: string = '';
  role: Role = Role.USER;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<EMPLOYE>) {
    Object.assign(this, init);
  }
}

export enum TypePiece {
  CNIB = 'CNIB',
  PASSPORT = 'PASSPORT',
}

export enum Genre {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
