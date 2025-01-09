

export class REGISTRE{

  id: number;
  nom: string;
  prenom : string;
  telephone:  string;
  numeroPiece:  string;
  numeroTicket:  string;
  montant:  string;
  date:  Date;
  codeClub:  string;

  constructor(){
    this.id = 0;
    this.nom = '';
    this.prenom = '';
    this.telephone = '';
    this.numeroPiece = '';
    this.numeroTicket = '';
    this.montant = '';
    this.date = new Date();
    this.codeClub = '';
  }
}

