import { CLIENT } from "../../page-nouvel-user/new-client/client.model";
import { TICKET } from "../new-ticket/ticket.model";

export class DEMANDE {
  public id: number;
  public etablisementDate: Date;
  public reference: string;
  public refClient: string;
  /* clientDto: CLIENT; */
  public nom: string;
  public prenom: string;
  public ticketDto: TICKET;
  public status: Status;

  constructor(
    demande : DEMANDE = {} as DEMANDE
  ) {
    this.id = demande.id ?? 0;
    this.etablisementDate = demande.etablisementDate ?? new Date('');
    this.reference = demande.reference || '';
    this.refClient = demande.refClient;
    /* this.clientDto = new CLIENT; */
    this.nom = demande.nom;
    this.prenom = demande.prenom;
    this.ticketDto = demande.ticketDto ?? new TICKET();;
    this.status = Status.INITIE;
  }
}

export enum Produit {
  PMUB = 'PMUB',
  ECD = 'ECD',
  TOMBOLA = 'TOMBOLA',
  TELE_FORTUNE = 'TELE FORTUNE',
  FASO_LOTO = 'FASO LOTO'
}

export enum Status {
  INITIE = 'INITIE',
  VALIDE_DR = 'VALIDE PAR DR',
  VALIDE_DG = 'VALIDE PAR DG',
  VALIDE_DFC = 'VALIDE PAR DFC',
  TERMINE = 'PAYE PAR CAISSIER'
}

