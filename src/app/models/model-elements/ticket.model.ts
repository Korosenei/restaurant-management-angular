import { TRANSACTION } from "./transaction.model";
import { USER } from "../model-users/user.model";

export class TICKET {
  id: number = 0;
  numero: string = '';
  dateValid: Date = new Date()
  status: Status = Status.VALIDE;
  transactionDto: TRANSACTION | null = null;
  userDto: USER | null = null;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<TICKET>) {
    Object.assign(this, init);
  }
}

export enum Status {
  VALIDE = 'VALIDE',
  INVALIDE = 'INVALIDE',
  CONSOMME = 'CONSOMME'
}
