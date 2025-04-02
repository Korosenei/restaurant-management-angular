import { USER } from "../model-users/user.model";

export class RESTAURANT {
  id: number = 0;
  code: string = '';
  nom: string = '';
  ville: string = '';
  telephone: number = 0;
  manager : USER | null = null
  menuDtos: string = '';
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<RESTAURANT>) {
    Object.assign(this, init);
  }
}
