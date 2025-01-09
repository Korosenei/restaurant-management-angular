import { DEMANDE } from "../new-demande/demande.model";


export class TICKET {
  id: number;
  numero: string;
  produit: Produit;
  montant: number;
  dateJeu: Date;
  naturePayement: Payement;
  /* demande: DEMANDE; */

  constructor() {
    this.id = 0;
    this.numero = '';
    this.produit = Produit.PMUB;
    this.montant = 0;
    this.dateJeu = new Date();
    this.naturePayement = Payement.CHEQUE;
    /* this.demande = new DEMANDE(); */
  }
}

export enum Produit {
  PMUB = 'PMUB',
  ECD = 'ECD',
  TOMBOLA = 'TOMBOLA',
  TELE_FORTUNE = 'TELE FORTUNE',
  FASO_LOTO = 'FASO LOTO'
}

export enum Payement{
  ESPECE = "ESPECE",
  CHEQUE = "CHEQUE"
}

