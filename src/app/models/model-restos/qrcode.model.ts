import { TICKET } from "../model-elements/ticket.model";
import { USER } from "../model-users/user.model";

export class QRCODE {
  id: number = 0;
  clientId: number = 0;
  ticketId: number = 0;
  ticket: TICKET | null = null;
  client: USER | null = null;
  qrCodeData: string = '';
  active: boolean = true;
  consumed: boolean = false;
  creationDate: Date = new Date();
  expirationDate: Date = new Date();
  consumedDate: Date = new Date();

  constructor(init?: Partial<QRCODE>) {
    Object.assign(this, init);
  }
}
