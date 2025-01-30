import { AGENCE } from "./agence.model";

export class PASSAGE {
  id: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  agences: string = '';
  resto: string = '';
  userDto: string = '';
  agenceDtos: AGENCE[] = [];
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<PASSAGE>) {
    Object.assign(this, init);
  }
}
