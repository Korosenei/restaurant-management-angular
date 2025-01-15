
export class TRANSACTION {
  public id: number;
  public date: Date;
  public refClient: string;
  public nom: string;
  public prenom: string;
  public reference: string;
  public nbrTicket: number;
  public firstNumTicket: string;
  public lastNumTicket: string;
  public payement: Payement.ESPECE;
  public montant: number;

  constructor(
    transaction : TRANSACTION = {} as TRANSACTION
  ) {
    this.id = transaction.id ?? 0;
    this.date = transaction.date ?? new Date('');
    this.reference = transaction.reference || '';
    this.refClient = transaction.refClient;
    this.nom = transaction.nom;
    this.prenom = transaction.prenom;
    this.nbrTicket = transaction.nbrTicket;
    this.firstNumTicket = transaction.firstNumTicket;
    this.lastNumTicket = transaction.lastNumTicket;
    this.payement = Payement.ESPECE;
    this.montant = transaction.montant;
  }
}

export enum Payement{
  ESPECE = "ESPECE",
  MOBILE_MONEY = "MOBILE MONEY"
}
