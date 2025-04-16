import { TICKET } from "../model-elements/ticket.model";
import { TRANSACTION } from "../model-elements/transaction.model";
import { AGENCE } from "../model-structures/agence.model";
import { USER } from "../model-users/user.model";

export class QRCODE {
  id: number = 0;
  agenceId: number = 0;
  clientId: number = 0;
  transactionId: number = 0;
  ticketId: number = 0;
  agence: AGENCE | null = null;
  transaction: TRANSACTION | null = null;
  ticket: TICKET | null = null;
  client: USER | null = null;
  qrCodeData: string = '';
  creationDate: Date = new Date();
  expirationDate: Date = new Date();
  consumed: boolean = false;

  constructor(init?: Partial<QRCODE>) {
    Object.assign(this, init);
  }
}
