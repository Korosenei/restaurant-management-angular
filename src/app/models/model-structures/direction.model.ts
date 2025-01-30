import { EMPLOYE } from "../model-users/employe.model";
import { AGENCE } from "./agence.model";

export class DIRECTION {
  id: number = 0;
  code: string = '';
  nom: string = '';
  sigle: string = '';
  region: string = '';
  ville: string = '';
  userId: string ='';
  responsable: EMPLOYE | null = null
  agenceDtos: string = '';
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<DIRECTION>) {
    Object.assign(this, init);
  }
}
