import { AGENCE } from "../model-structures/agence.model";
import { RESTAURANT } from "../model-restos/restaurant.model";
import { USER } from "../model-users/user.model";

export class PROGRAMME {
  id: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  actif: boolean = true;

  agence: AGENCE | null = null;
  resto: RESTAURANT | null = null;
  user: USER | null = null;

  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  isDeleted: boolean = false;

  constructor(init?: Partial<PROGRAMME>) {
    Object.assign(this, init);
  }
}
