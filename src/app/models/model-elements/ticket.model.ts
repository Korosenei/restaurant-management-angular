export class TICKET {
  id: number;
  refTransaction: string;
  numero: string;
  dateValid: Date;
  montant: number;
  status: Status;

  constructor() {
    this.id = 0;
    this.refTransaction = '';
    this.numero = '';
    this.dateValid = new Date();
    this.montant = 0;
    this.status = Status.VALIDE;
  }
}

export enum Status {
  VALIDE = 'VALIDE',    //Générer par le système
  INVALIDE = 'INVALIDE', //Non Reconnu par le système
  CONSOMME = 'CONSOMME'   // Consommé
}
