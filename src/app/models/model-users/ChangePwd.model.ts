
export class CHANGEPWD {
  matricule: string = '';
  lastPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  modifiedDate: Date = new Date();

  constructor(init?: Partial<CHANGEPWD>) {
    Object.assign(this, init);
  }
}
