import { RESTAURANT } from "./restaurant.model";

export class MENU {
  id: number = 0;
  nom: string = '';
  description: string = '';
  image: string = '';
  restaurant: RESTAURANT | null = null;
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<MENU>) {
    Object.assign(this, init);
  }
}
