import { USER } from "../model-users/user.model";

export class PARAMSACHAT {
  id: number = 0;
  prixTicket: number = 500;
  minTicketParTransaction: number = 20;
  maxAchatParClient: number = 1;
  minTicketParTransactionMensuelle: number = 20;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  user: USER | null = new USER();
  deleted: boolean = false;

  constructor(init?: Partial<PARAMSACHAT>) {
    Object.assign(this, init);
  }
}
