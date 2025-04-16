
export class FORGOTPWD {
  matricule: string = '';
  email: string = '';
  resetCode: string = '';
  resetCodeExpiration: Date = new Date();

  constructor(init?: Partial<FORGOTPWD>) {
    Object.assign(this, init);
  }
}
