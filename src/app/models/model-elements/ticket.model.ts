import { TRANSACTION } from "./transaction.model";
import { EMPLOYE } from "../model-users/employe.model";

export class TICKET {
  public id: number;
  /* public refTransaction: string; */
  public numero: string;
  public dateValid: Date;
  public status: Status;
  public transactionDto: TRANSACTION;
  public employeDto: EMPLOYE;

  constructor(
    ticket : TICKET = {} as TICKET
  ) {
    this.id = 0;
    this.numero = '';
    this.dateValid = new Date();
    this.status = Status.VALIDE;
    this.transactionDto = ticket.transactionDto;
    this.employeDto = ticket.employeDto;
  }
}

export enum Status {
  VALIDE = 'VALIDE',    //Générer par le système
  INVALIDE = 'INVALIDE', //Non Reconnu par le système
  CONSOMME = 'CONSOMME'   // Consommé
}
