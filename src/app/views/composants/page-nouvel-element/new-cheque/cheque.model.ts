

export class CHEQUE{

  id: number;
  dateEtablissement:  Date;
  numero: string;
  montant : number;
  refDemande:  string;
  banque:  string;

  constructor(){
    this.id = 0;
    this.dateEtablissement = new Date;
    this.numero = '';
    this.montant = 0;
    this.refDemande = '';
    this.banque = '';
  }
}

