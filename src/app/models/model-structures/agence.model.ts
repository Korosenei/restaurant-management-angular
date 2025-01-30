import { EMPLOYE } from "../model-users/employe.model";
import { DIRECTION } from "./direction.model";
import { PASSAGE } from "./passage.model";

export class AGENCE {
  id: number = 0;
  code: string = '';
  nom: string = '';
  sigle: string = '';
  ville: string = '';
  userId: string ='';
  responsable: EMPLOYE | null = null;
  directionDto: DIRECTION | null = null;
  passageDtos: PASSAGE[] = [];
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<AGENCE>) {
    Object.assign(this, init);
  }
}
