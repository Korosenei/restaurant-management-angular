import { TRANSACTION } from "./transaction.model";
import { EMPLOYE } from "../model-users/employe.model";

export class TICKET {
  public id: number;
  public numero: string;
  public dateValid: Date;
  public status: Status;
  public transactionDto: TRANSACTION | null;
  public employeDto: EMPLOYE | null;

  constructor(ticket: Partial<TICKET> = {}) {
    this.id = ticket.id || 0;
    this.numero = ticket.numero || '';
    this.dateValid = ticket.dateValid || new Date();
    this.status = ticket.status || Status.VALIDE;
    this.transactionDto = ticket.transactionDto || null;
    this.employeDto = ticket.employeDto || null;
  }
}

export enum Status {
  VALIDE = 'VALIDE',    //Générer par le système
  INVALIDE = 'INVALIDE', //Non Reconnu par le système
  CONSOMME = 'CONSOMME'   // Consommé
}
