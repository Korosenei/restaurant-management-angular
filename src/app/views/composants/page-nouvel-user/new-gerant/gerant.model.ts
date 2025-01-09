import {CLUB} from '../../page-nouvel-service/new-club/club.model'

export class GERANT{

  id: number;
  matricule!: string;
  typePiece!: string;
  cnibNumber!: string;
  nipCnib!: string;
  passportNumber!: string;
  nom!: string;
  prenom!: string;
  genre!: string;
  email!: string;
  telephone!: string;

  constructor() {
    this.id = 0;
    this.matricule = '';
    this.typePiece = '';
    this.cnibNumber = '';
    this.nipCnib = '';
    this.passportNumber = '';
    this.nom = '';
    this.prenom = '';
    this.genre = '';
    this.email = '';
    this.telephone = '';
  }
}

