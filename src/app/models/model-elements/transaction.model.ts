import { USER } from "../model-users/user.model";
import { TICKET } from "./ticket.model";

export class TRANSACTION {
  id: number = 0;
  date: Date = new Date();
  reference: string = '';
  userId: number = 0;
  clientId: number = 0;
  nom: string = '';
  prenom: string = '';
  nbrTicket: number = 20;
  firstTicketNum: string = '';
  lastTicketNum: string = '';
  payement: Payement = Payement.ESPECE;
  montant: number = 500;
  ticketDto: TICKET | null = null
  userDto: USER | null = null
  client: USER | null = null
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<TRANSACTION>) {
    Object.assign(this, init);
  }
}

export enum Payement{
  ESPECE = "ESPECE",
  MOBILE_MONEY = "MOBILE MONEY"
}
