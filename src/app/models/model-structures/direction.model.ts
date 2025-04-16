import { USER } from "../model-users/user.model";
import { AGENCE } from "./agence.model";

export class DIRECTION {
  id: number = 0;
  code: string = '';
  nom: string = '';
  sigle: string = '';
  region: string = '';
  ville: string = '';
  responsable: USER | null = null;
  agenceDtos: AGENCE[] = [];
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<DIRECTION>) {
    Object.assign(this, init);
  }
}
