export class ROLE {
  id: number = 0;
  name: RoleName = RoleName.USER;
  label: string = '';
  creationDate: Date = new Date();
  modifiedDate: Date = new Date();
  deleted: boolean = false;

  constructor(init?: Partial<ROLE>) {
    Object.assign(this, init);
  }
}

export enum RoleName {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CAISSIER = 'CAISSIER',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  AUTRE = 'AUTRE',
}
